const logger = require('../../utils/logger');
const FrequencyDAO = require('./frequency.dao');
const MyConst = require('../utils');
const uuid = require('uuid-random');
const { Transaction } = require('sequelize');
const Cryptic = require('../../utils/cryptic');
const Helper = require('../../utils/helper');

module.exports = class FrequencyModel {

    constructor(
        frequency_id, frequency, order, created_at, updated_at, isActive = 1, uuid
    ) {
        this.frequency_id = frequency_id; this.frequency = frequency; this.order = order; this.uuid = uuid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }


    /**
 * To insert into DB
 * @param obj FrequencyModel 
 */
    static async createFrequency(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + FrequencyModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        // let uu = uuid(); 
        const data = " " + (JSON.stringify(obj.frequency)) + " " + (JSON.stringify(obj.order));
        // console.log("DATA", ddd);
        let uu = Cryptic.hash(data);
        // console.log("UUID ", uu);

        const frequencyData = {
            frequency: obj.frequency,
            order: obj.order,
            uuid: uu
        }
        let created = null;
        try {

            created = await FrequencyDAO.create(frequencyData);

        } catch (e) {
            logger.error('Unable to Create Frequency');
            logger.error(e);
        }

        if (created) {
            return await FrequencyModel.getFrequencyById(created['null'])
        }
        return created;
    }

    /**
     * Utility function to get all Frequency
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getFrequency(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        //  return await Helper.dbInstance.transaction(async t => {
        return await FrequencyDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            where: {
                isActive: true
            },
            offset: from,
            limit: limit
        });
        //  });
    }


    /**
     * Utility function to get by Frequency Id
     * @param frequencyId
     * @returns any
     */
    static async getFrequencyById(frequencyId = 0) {
        //  return await Helper.dbInstance.transaction(async t => {
        return await FrequencyDAO.findAll({
            where: {
                frequency_id: frequencyId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
        //  });
    }


    /**
     * Utility function to update by Frequency Id
     * @param frequencyId
     * @params obj
     * @returns any
     */
    static async updateFrequencyById(frequencyId = 0, obj = null) {
        let updated = null;
        try {
            updated = await FrequencyDAO.update(obj, {
                where: {
                    frequency_id: frequencyId
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Frequency');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return FrequencyModel.getFrequencyById(frequencyId);
        } else {
            return null;
        }
    }

    /**
 * Utility function to delete by Frequency Id
 * @param frequencyId
 * @returns any
 */
    static async deleteFrequencyById(frequencyId = 0, fource = false) {
        if (!fource) {
            const del =  await FrequencyModel.updateFrequencyById(frequencyId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await FrequencyDAO.destroy({
            where: {
                frequency_id: frequencyId
            }
        });
    }


    //Operations on UUID
    static async getFrequencyByUUId(uuid = 0) {
        return await FrequencyDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async updateFrequencyByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await FrequencyDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Frequency');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return FrequencyModel.getFrequencyByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteFrequencyByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del =  await FrequencyModel.updateFrequencyByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await FrequencyDAO.destroy({
            where: {
                uuid: uuid
            }
        });
    }
}