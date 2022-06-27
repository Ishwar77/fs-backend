const logger = require('../../utils/logger');
const UserReferralDAO = require('./user-referral.dao');
const UserRoleMasterDAO = require('../user-role-master/user-role-master.dao');
const MyConst = require('../utils');
const UserDao = require('../user-module/user.dao');
const Cryptic = require('../../utils/cryptic');
const Helper = require('../../utils/helper');

const ID_TYPE = {
    "REFERRAL_ID": 1,
    "REFERRING_USER_ID": 2,
    "INVITED_USER_ID": 3
};
module.exports = class UserReferralModel {

    constructor(
        referral_id, referrering_user, invited_user, isActive, created_at, updated_at, uuid, points_gained
    ) {
        this.referral_id = referral_id; this.referrering_user = referrering_user;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
        this.invited_user = invited_user; this.uuid = uuid; this.points_gained = points_gained;
    }

    /**
     * To insert into DB
     */
    static async create(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + UserReferral + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.referrering_user)) + " " + (JSON.stringify(obj.invited_user));
        let uuids = Cryptic.hash(data);

        const referralData = {
            referrering_user: obj.referrering_user,
            invited_user: obj.invited_user,
            points_gained: obj.points_gained,
            uuid: uuids
        }
        let created = null;
        try {

            created = await UserReferralDAO.create(referralData);
        } catch (e) {
            logger.error('Unable to Create UserReferral');
            logger.error(e);
        }

        if (created) {
            return await UserReferralModel.getUserReferralById(created['null']);
        }

        return created;
    }

    /**
     * Utility function to get all Referrals
     * To get all Referrals with property isActive = true
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getAllReferrals(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await UserReferralDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                {
                    model: UserDao, as: 'Referrering_User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true }
                    ]
                },
                {
                    model: UserDao, as: 'Invited_User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true }
                    ]
                }
            ]
        });
    }

    /**
     * Utility function to get by Referral Id
     * @param referralId
     * @returns any
     */
    static async getUserReferralById(referralId = 0) {

        return await UserReferralDAO.findOne({
            where: {
                referral_id: referralId
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: UserDao, as: 'Referrering_User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true }
                    ]
                },
                {
                    model: UserDao, as: 'Invited_User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true }
                    ]
                }
            ]
        });
    }

    /**
 * Utility function to get by Referring user's Id
 * @param userId
 * @param isRefrringUserId
 * @returns any
 */
    static async getUserReferralByUserIds(userId = 0, isRefrringUserId = true) {

        const whr = isRefrringUserId ? { referrering_user: userId } : { invited_user: userId };

        return await UserReferralDAO.findAll({
            where: whr,
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: UserDao, as: 'Referrering_User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true }
                    ]
                },
                {
                    model: UserDao, as: 'Invited_User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true }
                    ]
                }
            ]
        });
    }

    /**
         * Utility function to update by referral by Id
         * @param id
         * @params obj
         * @returns any
         */
    static async updateReferral(id = 0, obj = null, idType = ID_TYPE.REFERRAL_ID) {
        let updated = null;
        // console.log('Updating, ', eventmasterId, obj);
        const whr = idType === ID_TYPE.REFERRAL_ID ? { referral_id: id } :
            idType === ID_TYPE.REFERRING_USER_ID ? { referrering_user: id } : { invited_user: id }

        try {
            updated = await UserReferralDAO.update(obj, {
                where: whr
            });
        } catch (e) {
          //  console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Referral');
                logger.error(e);
            }
        }
        //  console.log('updated[0] = ', updated[0]);
        if (updated && updated.length && parseInt(updated[0]) === 1) {
            const res = idType === ID_TYPE.REFERRAL_ID ? await UserReferralModel.getUserReferralById(id) :
                idType === ID_TYPE.REFERRING_USER_ID ? await UserReferralModel.getUserReferralByUserIds(id, true)
                    : await UserReferralModel.getUserReferralByUserIds(id, false);
            return res;
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by User Id
     * Soft delete users, because this table will be refered by other dependent tables
     * @param referralId
     * @returns any
     */
    static async deleteByReferralId(referralId = 0, fource = false) {
        if (!fource) {
            const del = await UserReferralModel.updateReferral(referralId, { isActive: 0 });
            return del ? 1 : 0;
        }

        return await UserReferralDAO.destroy({
            where: {
                referral_id: referralId
            }
        });
    }

   
}
