const logger = require('../../utils/logger');
const Cryptic = require('../../utils/cryptic');
const EmailUtils = require('../../utils/emailUtils');
const AuthenticationDAO = require('./authentication.dao');
const MyConst = require('../utils');
const UserDao = require('../user-module/user.dao');
const UserRoleMasterDAO = require('../user-role-master/user-role-master.dao');
const AddressDAO = require('../address-module/address.dao');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');

module.exports = class AuthenticationModel {

    constructor(
        id, user_id, password, salt, created_at, updated_at, isActive = 1,
    ) {
        this.id = id; this.user_id = user_id; this.password = password;
        this.salt = salt; this.created_at = created_at;
        this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
   * To insert into DB
   * @param obj 
   */
    static async createAuthentication(obj) {

        let created = null
        try {
            created = await AuthenticationDAO.create(obj);
        } catch (e) {
            logger.error('Unable to Create Auth data');
            logger.error(e);
        }
        //  console.log("DAOCreated = ", created);
        if (created) {
            return await AuthenticationModel.getAuthenticationById(created['null'])
        }

        return created;

    }


    /**
     * Utility function to get all
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getAuthentication(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await AuthenticationDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                {
                    model: UserDao, as: 'User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true },
                        { model: AddressDAO, as: 'Address', allowNull: true }
                    ]
                }
            ]
        });
    }


    /**
 * Utility function to get by Event Id
 * @param authId
 * @returns any
 */
    static async getAuthenticationById(authId = 0) {
        return await AuthenticationDAO.findOne({
            where: {
                id: authId
            },
            include: [
                {
                    model: UserDao, as: 'User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true },
                        { model: AddressDAO, as: 'Address', allowNull: true }
                    ]
                }
            ]
        });

    }

    /**
    * Utility function to get by Event Id
    * @param userId
    * @returns any
    */
    static async getAuthenticationByUserId(userId = 0) {

        return await AuthenticationDAO.findOne({
            where: {
                user_id: userId
            }
        });

    }


    /**
     * Utility function to update by Event Id
     * @param authId
     * @params obj
     * @returns any
     */
    static async updateAuthenticationById(authId = 0, obj = null) {

        let updated = null;
        try {
            updated = await AuthenticationDAO.update(obj, {
                where: {
                    id: authId
                }
            });

        } catch (e) {
            logger.error('Unable to Update');
            logger.error(e);
        }

        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return AuthenticationModel.getAuthenticationById(authId);
        } else {
            return null;
        }
    }

    static async updateAuthenticationByUserId(userId = 0, obj = null) {

        let updated = null;
        try {
            updated = await AuthenticationDAO.update(obj, {
                where: {
                    user_id: userId
                }
            });

        } catch (e) {
            logger.error('Unable to Update');
            logger.error(e);
        }

        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return AuthenticationModel.getAuthenticationByUserId(userId);
        } else {
            return null;
        }
    }


    /**
  * Utility function to delete by Event Id
  * @param authId
  * @returns any
  */
    static async deleteAuthenticationById(authId = 0, fource = false) {
        if (!fource) {
            const del = await AuthenticationModel.updateAuthenticationById(authId, { isActive: 0 });
            return del ? 1 : 0;
        }

        return await AuthenticationDAO.destroy({
            where: {
                id: authId
            }
        });

    }


        /** To complete password reset action  */
        static async resetPassword(email, password) {
            var UserModel = require('../user-module/user.model');
            const match = await UserModel.getUserByEmailAddress(email);
    
            if (!match) {
                return { state: 'ERROR', message: "Your request cannot be processed at this moment." /* "Email Address not found" */ };
            }
            const userObj = match;
    
            const salt = (Cryptic.getKey()).toString('base64');
            const hashdPass = Cryptic.hash(password, salt);
    
            const auth = {
                password: hashdPass,
                salt: salt,
                updated_at: new Date()
            };
    
            let authObj = await AuthenticationModel.updateAuthenticationByUserId(userObj.user_id, auth);
            if (!authObj) {
                auth['user_id'] = userObj.user_id;
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
}