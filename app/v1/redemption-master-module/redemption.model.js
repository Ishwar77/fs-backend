const logger = require('../../utils/logger');
const RedemptionMasterDAO = require('./redemption.dao');
const MyConst = require('../utils');
const uuid = require('uuid-random');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');
const RedemptionAction = require("./redemptionpoints");
module.exports = class RedemptionMasterModel {

    constructor(
        id, action_name, points, percentage_value, created_at, updated_at, isActive = 1, uuid
    ) {
        this.id = id; this.action_name = action_name;
        this.points = points; this.uuid = uuid; this.percentage_value = percentage_value,
            this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }


    /**
     * To insert into DB
     * @param obj RedemptionMasterModel 
     */
    static async createRedemptionMaster(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + RedemptionMasterModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.action_name)) + " " + (JSON.stringify(obj.points));
        let uuids = Cryptic.hash(data);
        const RedemptionMasterData = {
            action_name: obj.action_name,
            points: obj.points,
            percentage_value: obj.percentage_value,
            uuid: uuids
        }
        let created = null;
        try {
            return await RedemptionMasterDAO.create(RedemptionMasterData);
        } catch (e) {
            logger.error('Unable to Create Redemption Master');
            logger.error(e);
        }
        if (created) {
            return await RedemptionMasterModel.getRedemptionMasterById(created['null'])
        }
        return created;
    }

    /**
* Utility function to get all RedemptionMaster
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getRedemptionMaster(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await RedemptionMasterDAO.findAll({
            where: {
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit
        });
    }

    /**
     * Utility function to get by Redemption Id
     * @param redemptionId
     * @returns any
     */
    static async getRedemptionMasterById(redemptionId = 0) {

        return await RedemptionMasterDAO.findAll({
            where: {
                id: redemptionId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    /**
    * Utility function to get by Action Name
    * @param actionName
    * @returns any
    */
    static async getRedemptionMasterByActionName(action = RedemptionAction.REFERRAL_USER) {

        return await RedemptionMasterDAO.findOne({
            where: {
                action_name: action,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    /**
         * Utility function to update by Redemption Id
         * @param redemptionId
         * @params obj
         * @returns any
         */
    static async updateRedemptionMasterById(redemptionId = 0, obj = null) {
        let updated = null;
        try {
            updated = await RedemptionMasterDAO.update(obj, {
                where: {
                    id: redemptionId
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Points Master');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return RedemptionMasterModel.getRedemptionMasterById(redemptionId);
        } else {
            return null;
        }
    }

    /**
 * Utility function to delete by Redemption Id
 * @param redemptionId
 * @returns any
 */
    static async deleteRedemptionMasterById(redemptionId = 0, fource = false) {
        if (!fource) {
            const del = await RedemptionMasterModel.updateRedemptionMasterById(redemptionId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await RedemptionMasterModel.destroy({
            where: {
                id: redemptionId
            }
        });
    }

    //Operations on UUID
    static async getRedemptionMasterByUUId(uuid = 0) {
        return await RedemptionMasterDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async updateRedemptionMasterByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await RedemptionMasterDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Redemption Master');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return RedemptionMasterModel.getRedemptionMasterByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteRedemptionMasterByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del = await RedemptionMasterModel.updateRedemptionMasterByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await RedemptionMasterModel.destroy({
            where: {
                uuid: uuid
            }
        });
    }
}