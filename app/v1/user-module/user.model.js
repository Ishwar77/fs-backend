const logger = require('../../utils/logger');
const UserDAO = require('./user.dao');
const MyConst = require('../utils');
const UserRoleMasterDAO = require('../user-role-master/user-role-master.dao');
const AddressDAO = require('../address-module/address.dao');
const Helper = require('../../utils/helper');
const Paths = require('../../../paths');
const ApiResponse = require('../../models/apiResponse');
const EmailUtil = require("../../utils/emailUtils");
const RegistrationDAO = require("../event-registration/eventregistration.dao");
const RegBatchDao = require("../event-registration-batches/event-reg-batch.dao");
const { Transaction } = require('sequelize');
const UserReferralDAO = require("../user-referral-module/user-referral.dao");
const Cryptic = require('../../utils/cryptic');
module.exports = class UserModel {

    constructor(
        user_id, user_role_id, address_id, diaplay_name, mobile_number, email_id, profile_picture_url,
        referral_code, isActive, created_at, updated_at, gender, dob, designation, expertise_in, uuid,
        pageName = null, experience, location
    ) {
        this.user_id = user_id; this.user_role_id = user_role_id; this.address_id = address_id;
        this.diaplay_name = diaplay_name; this.mobile_number = mobile_number;
        this.email_id = email_id; this.profile_picture_url = profile_picture_url;
        this.referral_code = referral_code; this.uuid = uuid; this.pageName = pageName || null;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
        this.gender = gender; this.dob = dob; this.designation = designation; 
        this.expertise_in = expertise_in; this.experience = experience; this.location = location;
    }

    /**
     * To insert into DB
     */
    static async createUser(obj) {
        if (!obj /* || obj instanceof EventMasterModel === false */) {
            const err = "Expecting input of type,'" + UserModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        let created = null;
        try {

            created = await UserDAO.create(obj);
        } catch (e) {
            logger.error('Unable to Create User');
            logger.error(e);
        }

        if (created) {
            return await UserModel.getUserById(created['null'])
        }

        return created;
    }

    /**
     * Utility function to get all User
     * To get all users with property isActive = true
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getUser(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await UserDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true },
                { model: AddressDAO, as: 'Address', allowNull: true }
            ]
        });
    }

    static async getInactiveUser(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await UserDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: false
            },
            include: [
                { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true },
                { model: AddressDAO, as: 'Address', allowNull: true }
            ]
        });
    }

    /**
     * Utility function to get by Event Master Id
     * @param userId
     * @returns any
     */
    static async getUserById(userId = 0) {

        return await UserDAO.findOne({
            where: {
                user_id: userId
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true },
                { model: AddressDAO, as: 'Address', allowNull: true }
            ]
        });
    }


    /**
     * Utility function to get by Trainer by pageName
     * @param pageName string
     * @returns any
     */
    static async getUserByPageName(pageName = null) {
        // NOTE Additional Role based condition can be added
        return await UserDAO.findOne({
            where: {
                pageName: pageName
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true },
                { model: AddressDAO, as: 'Address', allowNull: true }
            ]
        });
    }

    /**
         * Utility function to update by UserRoleMaster Id
         * @param userId
         * @params obj
         * @returns any
         */
    static async updateUserById(userId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', eventmasterId, obj);
        try {
            updated = await UserDAO.update(obj, {
                where: {
                    user_id: userId
                }
            });
        } catch (e) {
            console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update User');
                logger.error(e);
            }
        }
        //  console.log('updated[0] = ', updated[0]);
        if (updated && updated.length && parseInt(updated[0]) === 1) {
            return await UserModel.getUserById(userId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by User Id
     * Soft delete users, because this table will be refered by other dependent tables
     * @param userId
     * @returns any
     */
    static async deleteUserById(userId = 0, fource = false) {
        if (!fource) {
            const del = await UserModel.updateUserById(userId, { isActive: 0 });
            return del ? 1 : 0;
        }

        return await UserDAO.destroy({
            where: {
                user_id: userId
            }
        });
    }

    static async getUserByEmailAddress(emailAddress = null) {

        return await UserDAO.findOne({
            where: {
                email_id: emailAddress,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async getBlockedInstructor(userRoleId) {
        return await UserDAO.findAll({
            where: {
                user_role_id: userRoleId,
                isActive: false
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async getInstructor(userRoleId) {

        return await UserDAO.findAll({
            where: {
                user_role_id: userRoleId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async onboardClients(res, trainerId, file) {
        // validate the file
        if (!file) {
            ApiResponse.sendResponse(res, 400, { state: "ERROR", message: "Data File is missing" });
            return;
        }
        const tempPath = Paths.uploads + Paths.pathSeperator + "temp" + Paths.pathSeperator + trainerId + Paths.pathSeperator + file.name;

        //  console.log('Temp FIle Paht = ', tempPath);
        let resr = null;
        return await file.mv(tempPath, (err, result) => {
            if (err) {
                ApiResponse.sendResponse(res, 400, { state: "ERROR", message: "Unabel to the data file" });
                return;
            }

            // 1. read data from path target
            const OnboardingUtility = require('./onboarding-utility');
            const userRole = 3;
            const referralCode = 'RefCode';
            const recoards = OnboardingUtility.readExcelFileContent(tempPath, trainerId, userRole, referralCode);
            // console.log('recoards = ', recoards);

            // delete file
            const fs = require('fs');
            try {
                fs.unlink(tempPath, (e) => {
                    if (e) {
                        console.log(`Deleting the file manually ${tempPath}, error = `, e)
                    }
                    //   console.log('Deleted');
                });
            } catch (e) {
                console.log(`Deleting the file manually ${tempPath}, error = `, e)
            }

            if (recoards.state !== 'ERROR' && recoards.success.length) {
                resr = recoards;

                // Insert users into DB
                let msg = null;

                const newUsersAndUUID = recoards.success.map( u => {
                    const userUUID = Cryptic.hash( new Date().toDateString() + u['diaplay_name'] + u['email_id'])
                    return Object.assign({}, u, {
                        uuid: userUUID,
                        referral_code: userUUID 
                    });
                })
              //  console.log('newUsersAndUUID = ', newUsersAndUUID);
                UserDAO.bulkCreate(newUsersAndUUID, { validate: true, returning: true })
                    .then(() => {
                        return UserDAO.findAll({
                            where: {
                                isActive: true
                            },
                        });
                    })
                    .then(async re => {
                        // re will have all active users, we will need last X results
                        const newUsersList = re.slice(re.length - recoards.success.length);

                        // Insert into referrals
                        const bulkReferrals = newUsersList.map( newUser =>  {
                            return {
                                referrering_user: trainerId,
                                invited_user: newUser['user_id'],
                                uuid: Cryptic.hash( new Date().toDateString() + newUser['user_id'] + newUser['uuid'])
                            }
                        });
                      //  console.log('bulkReferrals = ', bulkReferrals);
                        await UserReferralDAO.bulkCreate(bulkReferrals,  { validate: true, returning: true });

                        // TODO : Bind all this in a READ COMMIT transaction

                        // 1. Update UserId in Registration List and create Registrations
                        let i = 0;
                        recoards.registrations.forEach(reg => {
                            reg.user_id = newUsersList[i++].user_id;
                        });
                        // 2. Update Registration Id's in Batch list and create Batches
                        RegistrationDAO.bulkCreate(recoards.registrations, { validate: true, returning: true })
                            .then(() => {
                                return RegistrationDAO.findAll({
                                    where: {
                                        isActive: true
                                    },
                                });
                            }).then(regData => {
                                const newRegData = regData.slice(regData.length - recoards.success.length);

                                // 1. Set Registration Ids to RegBatch
                                let x = 0;
                                recoards.batches.forEach(regs => {
                                    regs.registration_id = newRegData[x++].registration_id;
                                });

                                // 2. Insert Into Registration Batch
                                RegBatchDao.bulkCreate(recoards.batches, { validate: true, returning: true })
                                    .then(() => {
                                        return RegBatchDao.findAll({
                                            where: {
                                                isActive: true
                                            },
                                        });
                                    }).then(batches => {
                                        const newBatches = batches.slice(regData.length - recoards.success.length);

                                        // 1. Set Registration Ids to RegBatch
                                        let x = 0;
                                        msg = "Onboarding Success";

                                        // TODO manage bulk email
                                        // Send Email
                                        const to = newUsersList.map(user => user.email_id);
                                        try {
                                            //  console.log('To = ', to);
                                            const emailText = EmailUtil.getOnboardMessage();
                                            (async () => {
                                                await Helper.sendEMail(to.join(', '),
                                                    "Welcome to The Fit Socials",
                                                    null,
                                                    emailText,
                                                    EmailUtil.getFromAddress()
                                                );
                                            })();

                                        } catch (e) {
                                            msg += " | Error while sending the notification email, to the onboarded users";
                                        }

                                        ApiResponse.sendResponse(res, 200, msg, { failed: recoards.failed, passed: newUsersList });

                                    });
                            });

                    }).catch(e => {
                        console.log(e);
                        ApiResponse.sendResponse(res, 400, 'Failed to Onboard clients. All uploaded data has been ignored.',
                            { failed: recoards.failed, error: e['errors'] });
                    });



            } else if (!recoards.success || !recoards.success.length) {
                ApiResponse.sendResponse(res, 400, 'Bad or Corupted data file', { failed: recoards.failed });
            }

        });
    }


    //Operations on UUID
    static async getUserByUUId(uuid = 0) {
        return await UserDAO.findOne({
            where: {
                uuid: uuid
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true },
                { model: AddressDAO, as: 'Address', allowNull: true }
            ]
        });
    }

    
    static async getUserSignedUpBetween(fromDateTime, toDateTime) {
        let result = null;
        const q = `SELECT
        user.uuid, user.user_role_id, user.diaplay_name, mobile_number, email_id, profile_picture_url, role_name
        FROM user
        INNER JOIN user_role_master ON user.user_role_id = user_role_master.user_role_id
            WHERE user.isActive = 1 AND
            user.created_at >= '${fromDateTime}' AND user.created_at <= '${toDateTime}'`;
        // console.log('Query = ', q);
        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Users signup detailed, using given Date Range");
            logger.error(e);
            result = [];
        }
        return result;
    }
}
