const logger = require('../../utils/logger');
const PointsMasterDAO = require('./points.dao');
const MyConst = require('../utils');
const uuid = require('uuid-random');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');
const PointsAction = require("./pointsActions");
module.exports = class PointsMasterModel {

    constructor(
        points_id, action_name, points, created_at, updated_at, isActive = 1, uuid
    ) {
        this.points_id = points_id; this.action_name = action_name;
        this.points = points; this.uuid = uuid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }


    /**
     * To insert into DB
     * @param obj PointsMasterModel 
     */
    static async createPointsMaster(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + PointsMasterModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.action_name)) + " " + (JSON.stringify(obj.points));
        let uuids = Cryptic.hash(data);
        const pointsMasterData = {
            action_name: obj.action_name,
            points: obj.points,
            uuid: uuids
        }
        let created = null;
        try {
            return await PointsMasterDAO.create(pointsMasterData);
        } catch (e) {
            logger.error('Unable to Create Points Master');
            logger.error(e);
        }
        if (created) {
            return await PointsMasterModel.getPointsMasterById(created['null'])
        }
        return created;
    }

    /**
* Utility function to get all PointsMaster
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getPointsMaster(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await PointsMasterDAO.findAll({
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
     * Utility function to get by Points Id
     * @param pointsId
     * @returns any
     */
    static async getPointsMasterById(pointsId = 0) {

        return await PointsMasterDAO.findAll({
            where: {
                points_id: pointsId,
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
    static async getPointsMasterByActionName(action = PointsAction.REFERRAL_USER) {

        return await PointsMasterDAO.findOne({
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
         * Utility function to update by Points Id
         * @param pointsId
         * @params obj
         * @returns any
         */
    static async updatePointsMasterById(pointsId = 0, obj = null) {
        let updated = null;
        try {
            updated = await PointsMasterDAO.update(obj, {
                where: {
                    points_id: pointsId
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
            return PointsMasterModel.getPointsMasterById(pointsId);
        } else {
            return null;
        }
    }

    /**
 * Utility function to delete by Points Id
 * @param pointsId
 * @returns any
 */
    static async deletePointsMasterById(pointsId = 0, fource = false) {
        if (!fource) {
            const del = await PointsMasterModel.updatePointsMasterById(pointsId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await PointsMasterModel.destroy({
            where: {
                points_id: pointsId
            }
        });
    }

    //Operations on UUID
    static async getPointsMasterByUUId(uuid = 0) {
        return await PointsMasterDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async updatePointsMasterByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await PointsMasterDAO.update(obj, {
                where: {
                    uuid: uuid
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
            return PointsMasterModel.getPointsMasterByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deletePointsMasterByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del = await PointsMasterModel.updatePointsMasterByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await PointsMasterModel.destroy({
            where: {
                uuid: uuid
            }
        });
    }
}