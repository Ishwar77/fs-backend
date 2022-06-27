const logger = require('../../utils/logger');
const UserRoleMasterDAO = require('./user-role-master.dao');
const MyConst = require('../utils');
const Cryptic = require('../../utils/cryptic');

module.exports = class UserRoleMasterModel {

    constructor(
        user_role_id, role_name, uuid, isActive = 1, created_at, updated_at
    ) {
        this.user_role_id = user_role_id; this.role_name = role_name; this.uuid = uuid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     */
    static async createUserRoleMaster(obj) {
        if (!obj /* || obj instanceof EventMasterModel === false */) {
            const err = "Expecting input of type,'" + UserRoleMasterModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.role_name));
        // console.log("DATA", ddd);
        let uuids = Cryptic.hash(data);
        // console.log("UUID ", uu);

        const userRoleMasterData = {
            role_name: obj.role_name,
            uuid: uuids
        }
        let created = null;
        try {

            return await UserRoleMasterDAO.create(userRoleMasterData);
        } catch (e) {
            logger.error('Unable to Create Event Master');
            logger.error(e);
        }

        if (created) {
            return await UserRoleMasterModel.getUserRoleMasterById(created['null'])
        }

        return created;
    }

    /**
     * Utility function to get all UserRoleMaster
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getUserRoleMaster(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await UserRoleMasterDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
        });
    }

    /**
     * Utility function to get by Event Master Id
     * @param userRolemasterId
     * @returns any
     */
    static async getUserRoleMasterById(userRolemasterId = 0) {
        return await UserRoleMasterDAO.findOne({
            where: {
                user_role_id: userRolemasterId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    /**
         * Utility function to update by UserRoleMaster Id
         * @param userRolemasterId
         * @params obj
         * @returns any
         */
    static async updateUserRoleMasterById(userRolemasterId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', eventmasterId, obj);
        try {
            updated = await UserRoleMasterDAO.update(obj, {
                where: {
                    user_role_id: userRolemasterId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update UserRoleMaster');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return UserRoleMasterModel.getUserRoleMasterById(userRolemasterId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Event Master Id
     * @param userRolemasterId
     * @returns any
     */
    static async deleteUserRoleMasterById(userRolemasterId = 0, fource = false) {
        if (!fource) {
            const del = await UserRoleMasterModel.updateUserRoleMasterById(userRolemasterId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await UserRoleMasterDAO.destroy({
            where: {
                user_role_id: userRolemasterId
            }
        });
    }


    //Operations on UUID
    static async getUserRoleMasterByUUId(uuid = 0) {
        return await UserRoleMasterDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async updateUserRoleMasterByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await UserRoleMasterDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update UserRoleMaster');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return UserRoleMasterModel.getUserRoleMasterByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteUserRoleMasterByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del = await UserRoleMasterModel.updateUserRoleMasterByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await UserRoleMasterDAO.destroy({
            where: {
                uuid: uuid
            }
        });
    }
}