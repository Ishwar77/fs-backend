const logger = require('../../../utils/logger');
const MyConst = require('../../utils');
const Helper = require('../../../utils/helper');
const Cryptic = require('../../../utils/cryptic');
const UserModel = require("../../user-module/user.model");
const AuthenticationModel = require("../authentication.model");
const PaymentModel = require('../../payment/payment.model');
const PointsModule = require('../../points-master-module/points.model');
const ReferralModel = require('../../user-referral-module/user-referral.model');
const config = require('config');
const JwtHelper = require('../../../utils/jwtHelper');
const JWTPaylod = require('../../../models/jwtPayload');
const EmailUtils = require('../../../utils/emailUtils');
const PointsAction = require("../../points-master-module/pointsActions");
const PointsMessage = require("../../user-points/points-description-msg");
const UserRewardModel = require("../../user-points/user-points.model");

module.exports = class LoginSignUpModel {

    static async makeLogin(reqBody, ip = null) {

        // console.log('Login Model = ', reqBody);

        // 1. Get userBy EmailId
        const match = await UserModel.getUserByEmailAddress(reqBody.email);
        // console.log('Matching User = ', match);

        if (!match) {
            return { state: 'ERROR', message: "Your request cannot be processed at the moment" };
        }
        /** user object, got from DB */
        const userObj = match;
        // console.log('UserObj = ', userObj);

        // 2. Verify Password in AuthTable
        const authMatch = await AuthenticationModel.getAuthenticationByUserId(userObj.user_id);
        if (!authMatch) {
            return { state: 'ERROR', message: "Authentication Failed" };
        }
        const authObj = authMatch;
        // console.log('authObj = ', authObj);

        // Hash and compare pawwords
        const psHash = Cryptic.hash(reqBody.password, authObj.salt);
        // console.log("PHash = ", psHash);
        if (psHash !== authObj.password) {
            return { state: 'ERROR', message: "Bad Credentials, unable to authenticate the user" };
        }

        const key = config.get('secretkey');
        const headerKey = Helper.getAppConfig()["tokenNameInRequests"] || 'x-maiora-auth-token';
        // const data = JSON.stringify({ userId: userObj.user_id, email: reqBody.email });

        const JWTPaylodData = new JWTPaylod(userObj.user_id, userObj.user_role_id || 3, (new Date()).getTime(), false, { IP: ip });

        // console.log('SecKey = ', key);
        // console.log('data = ', JSON.stringify(data));
        // console.log('headerKey = ', headerKey);
        // console.log('headerKey = ', Helper.getAppConfig());

        const token = await JwtHelper.create(JWTPaylodData, key, '1h');  // await Helper.createAuthToken({ payload: data }, key);
        // console.log('JWT = ', token);

        // TO verify generated JWT
        // const verif = await Helper.verifyAuthToken(token, key);
        // console.log('JWT verif = ', verif);


        // 3. Get List of permissions based on Role  (IGNORE)
        // 4. Generate JWT
        // 5. Make a session Entry (IGNORE)
        // 6. send response

        const loginResp = {
            state: 'SUCCESS',
            token: token,
            httpHeaderKey: headerKey,
            user: userObj
        };

        return loginResp;
    }


    static async makeSignup(reqBody, getUserObj = false) {

        // 0. Verify if the request has got "user_referral_code".
        // 0.1 If present
        // - Verify the referring user's uuid exists in the DB
        // - If the user exists
        // - Based on the registering user type, get the bonus_points object(REFERRAL_TRAINER / REFERRAL_USER)
        // 1. Now proceed to user creation
        // 2. Insert a row into user_referrals
        // 3. Add Bonus points to user who have refered

        let uu = Cryptic.hash(reqBody.email + new Date().getTime());
        // 1. Create user
        const userData = {
            diaplay_name: reqBody.name || null,
            dob: reqBody.dob,
            gender: reqBody.gender,
            email_id: reqBody.email,
            mobile_number: reqBody.mobile,
            user_role_id: reqBody.userRoleId || 3, // deafult as client
            isActive: reqBody.isActive,
            expertise_in: reqBody.expertise_in,
            experience: reqBody.experience,
            location: reqBody.location,
            referral_code: uu,
            uuid: uu
        };
        let newUrs = null;
        let newUserObj = null;
        // let verifyEmail = null;
        // verifyEmail = await UserModel.getUserByEmailAddress(userData.email_id);
        // console.log("EMAIL ", verifyEmail);
        try {

            try {
                // if(verifyEmail == null){
                newUrs = await UserModel.createUser(userData);
                newUserObj = newUrs
                //    console.log('Created user = ', newUrs);
                // } else {
                //     console.log("Email ID Already Exists")
                //     logger.error("Email ID Already Exists");
                //     return null;
                // }
            } catch (e) {
                logger.error("User creation itself not happening");
                logger.error(e);
                return null;
            }

            let referedUser = null;
            try {
                referedUser = await UserModel.getUserByUUId(reqBody.referral_code);
            } catch (e) {
                console.log(e);
            }

            if (referedUser) {
                referedUser['referral_code'] = referedUser['referral_code'] ? referedUser['referral_code'] : referedUser['uuid'];
                if (reqBody.referral_code && reqBody.referral_code.length) {

                    const referralAction = reqBody.userRoleId && reqBody.userRoleId === 3 ? PointsAction.REFERRAL_USER :
                        reqBody.userRoleId === 6 ? PointsAction.REFERRAL_TRAINER : null;
                    
                
                    let pointsMaster = null;
                    try {
                        pointsMaster = await PointsModule.getPointsMasterByActionName(referralAction);
                    } catch (e) {
                        console.log(e);
                    }

                    // // Create Referral Points
                    // const referralPoints = PointsModule.getPointsMaster()

                    const referals = {
                        referrering_user: referedUser.user_id,
                        invited_user: newUserObj.user_id,
                        points_gained: pointsMaster.points
                    };
                    let reffObj = null;

                    try {
                        reffObj = await ReferralModel.create(referals);
                        //  console.log('reffObj = ', reffObj);
                        // TODO, Give reward points to person inviting
                        const rewardModel = {
                            "user_id": referedUser.user_id,
                            "credited_points": pointsMaster.points,
                            "debited_points": 0,
                            "comment": reqBody.userRoleId && reqBody.userRoleId === 3 ? PointsMessage.REFERRING_USER :
                                reqBody.userRoleId === 6 ? PointsMessage.REFERRING_TRAINER : null
                        };
                        await UserRewardModel.create(rewardModel);
                        await Helper.sendEMail(
                            referedUser.email_id,
                            "The Fit Socials: You WON Referral Bonus",
                            EmailUtils.referralSuccess(referedUser.diaplay_name, newUserObj.diaplay_name, pointsMaster.points),
                            EmailUtils.referralSuccess(referedUser.diaplay_name, newUserObj.diaplay_name, pointsMaster.points));


                        // Give points for user who signed-up
                        const signupPoints = await PointsModule.getPointsMasterByActionName(PointsAction.JOINING_BONUS);
                        const rewardModelForNewUser = {
                            "user_id": newUserObj.user_id,
                            "credited_points": signupPoints ? signupPoints.points : 10,
                            "debited_points": 0,
                            "comment": PointsMessage.SIGN_UP
                        };
                        await UserRewardModel.create(rewardModelForNewUser);

                    } catch (e) {
                        logger.error("Please enter a valid referral Code");
                        logger.error(e);
                       logger.info('Referring User = ' + JSON.stringify(referedUser));
                       logger.info('Invited User = ' + JSON.stringify(newUserObj));
                      //  return null;
                    }

                }
            }

            // 2. Create Auth entry

            // Random string
            const salt = (Cryptic.getKey()).toString('base64');
            const hashdPass = Cryptic.hash(reqBody.password, salt);

            const auth = {
                user_id: newUserObj.user_id,
                password: hashdPass,
                salt: salt
            };
            // console.log('auth Input = ', auth);
            let authObj = null;
            try {
                authObj = await AuthenticationModel.createAuthentication(auth);
            } catch (e) {
                logger.error("Auth Obj creation itself not happening");
                logger.error(e);
                return null;
            }

            if (authObj) {

                try {
                    await Helper.sendEMail(
                        reqBody.email,
                        "You have registered with The Fit Socials",
                        EmailUtils.getRegistrationTemplate(reqBody.name, reqBody.email),
                        EmailUtils.getRegistrationTemplate(reqBody.name, reqBody.email),
                        EmailUtils.getFromAddress()
                    );
                } catch (e) {
                    logger.error('Failed to send email, upon signup email address = ' + reqBody.email);
                    logger.error(e);
                }

                const res = { state: 'SUCCESS', message: "Sign Up Success", meta: null };

                if (getUserObj) {
                    res.meta = newUserObj;
                }
                return res;
            } else {
                logger.error('Unable to create auth Object');
                // remove user 
                try {
                    await UserModel.deleteUserById(newUserObj.user_id, true);
                } catch (e) {
                    console.log(e);
                    logger.error('Failed to delete the create user inner');
                    logger.error(e);
                }

                return { state: 'ERROR', message: "Something went wrong while signing up" };
            }

        } catch (e) {
            // duplicate data;
            logger.error('Failed to create user, due to error while creation of user / auth models');
            logger.error(e);
            logger.error(JSON.stringify(reqBody));
            try {
                if (newUserObj) {
                    await UserModel.deleteUserById(newUserObj.user_id, true);
                }
            } catch (e) {
                //   console.log(e);
                logger.error('Failed to delete the create user');
                logger.error(e);
            }
            return { state: 'ERROR', message: "Unable to create user" };
        }

        // return { state: 'ERROR', data: reqBody };

    }

    /** To complete password reset action  */
    static async makeReset(email, password, token) {
        // 1. Get userBy EmailId
        const match = await UserModel.getUserByEmailAddress(email);
        // console.log('Matching User = ', matchingUser);

        if (!match) {
            return { state: 'ERROR', message: "Your request cannot be processed at this moment." /* "Email Address not found" */ };
        }
        /** user object, got from DB */
        const userObj = match;
        // console.log('UserObj = ', userObj);

        // 2. Regenerate token
        const tokenGenerated = LoginSignUpModel.createPasswordResetToken(email);
        if (token !== tokenGenerated) {
            return { status: "ERROR", resetToken: token, message: "Invalid reset Token" };
        }

        // 3. Generate new salt, hashify password, update Auth Tab
        const salt = (Cryptic.getKey()).toString('base64');
        const hashdPass = Cryptic.hash(password, salt);

        const auth = {
            password: hashdPass,
            salt: salt,
            updated_at: new Date()
        };
        // console.log('auth Input = ', auth);

        let authObj = await AuthenticationModel.updateAuthenticationByUserId(userObj.user_id, auth);
        // console.log('authObj = ', authObj);
        if (!authObj) {
            auth['user_id'] = userObj.user_id;
            // TODO : Can accept a flag, instead of blindly doing this
            // This could be the newly created user, trying to reset the password
            authObj = (async () => {
                return await AuthenticationModel.createAuthentication(auth);
            })();
        }

        if (authObj) {
            const emailText = "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hi,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>You have Successfully reset your Password.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Please Login to the Website and continue enjoying our services.</p><a href = 'https://thefitsocials.com' target = '_blank'>CLICK HERE TO LOGIN</a><br><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries you can contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>";
            try {
                await Helper.sendEMail(email, "Password Reset Success", null, emailText, EmailUtils.getFromAddress());
            } catch (e) {
                logger.error('Unable to acknowledge Password reset action Email = ' + email);
                logger.error(e);
            }
            return { state: 'Your account information has been updated' };
        } else {
            return { state: 'ERROR', message: "Something went wrong while reset action" };
        }
    }




    /** To generate password reset token */
    static async makeResetToken(emailAddress) {
        // 1. Get userBy EmailId
        const match = await UserModel.getUserByEmailAddress(emailAddress);
        // console.log('Matching User = ', matchingUser);

        if (!match) {
            logger.error("Unable to reset Passowrd, " + emailAddress + "dont exist");
            return { state: 'ERROR', message: "If you have an account with us, you will get an email in few minutes." };
        } else {
            logger.info("Password Reset Action");
            logger.info( JSON.stringify(match) );
        }
        /** user object, got from DB */
        const userObj = match;
        // console.log('UserObj = ', userObj);

        // 2. Generate password reset token and send to user
        const token = LoginSignUpModel.createPasswordResetToken(emailAddress);

        try {
            // send email
            await Helper.sendEMail(emailAddress, "Password Reset Token", null,
                "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hello,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b>We received a request to reset your password.</b></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Please use the token below to setup a new password for your account.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>If you did not request to reset your password ignore this email.</p><p><h3>" + token + "</h3></p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries you can contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>",
                EmailUtils.getFromAddress());
        } catch (e) {
            console.log(e);
        }

        // TODO, this token must have an expiry; or lock the account till reset action is not complete
        return { status: "A password reset token has been emailed to you", /* resetToken: token */ };

    }

    static createPasswordResetToken(plainText) {
        if (!plainText) {
            return;
        }
        const key = Cryptic.transformData(plainText, 'ENC');
        return Cryptic.hash(plainText, key);
    }



    static async initSession(userId, userRole, isGuest, clientSignature) {

        const key = config.get('secretkey');
        const headerKey = Helper.getAppConfig()["tokenNameInRequests"] || 'x-maiora-auth-token';
        // const data = JSON.stringify({ userId: userObj.user_id, email: reqBody.email });

        const JWTPaylodData = new JWTPaylod(userId, userRole, (new Date()).getTime(), isGuest, clientSignature);

        const token = await JwtHelper.create(JWTPaylodData, key, '1h');  // await Helper.createAuthToken({ payload: data }, key);

        const initResp = {
            state: 'SUCCESS',
            token: token,
            httpHeaderKey: headerKey,
            // session: JWTPaylodData
        };

        return initResp;
    }


    /**
     * Used to register a trainer
     * @param {*} reqBody{user, payment} 
     */

    static async makePaymentAndSignUp(reqBody) {

        try {
            // 1. Create a Trainer
            const userCreateResponse = await LoginSignUpModel.makeSignup(reqBody.user, true);
            // console.log('userCreateResponse = ', userCreateResponse.meta);
            if (!userCreateResponse || userCreateResponse.state === 'ERROR' || !userCreateResponse.meta) {
                return userCreateResponse;
            }

            // 2. Insert Payment data
            const paymentData = reqBody.payment;
            paymentData['user_id'] = userCreateResponse.meta['user_id'];

            const paymentObj = await PaymentModel.createPayment(paymentData);
            //  console.log('paymentObj = ', paymentObj);

            if (paymentObj) {
                try {
                    await Helper.sendEMail(
                        reqBody.email,
                        "You have registered with The Fit Socials",
                        EmailUtils.getTrainerRegistrationTemplate(reqBody.user.name),
                        EmailUtils.getTrainerRegistrationTemplate(reqBody.user.name),
                        EmailUtils.getFromAddress()
                    );
                } catch (e) {
                    logger.error('Failed to send email, upon signup email address = ' + reqBody.email);
                    logger.error(e);
                }
                return { state: "SUCCESS", message: "Trainer Registration Success" };
            } else {
                return { state: "ERROR", message: "Trainer Registration Failed, refunds can be made after Two working days, on submission of Payment ID" };
            }

        } catch (e) {
            logger.error("Registering the Trainer failed");
            logger.error(e);
            logger.info(reqBody);
            return null;
        }
    }

}


