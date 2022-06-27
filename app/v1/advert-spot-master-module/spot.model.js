const joi = require('@hapi/joi');
const logger = require('../../utils/logger');
const AdvrSpotDAO = require('./spot.dao');
const MyConst = require('../utils');
const Cryptic = require('../../utils/cryptic');

module.exports = class AdvrSpotModel {

    constructor(
        spot_number, spot_name, spot_days, spot_amount, created_at, updated_at, isActive = 1, uuid
    ) {
        this.spot_number = spot_number; this.spot_name = spot_name;
        this.spot_days = spot_days; this.spot_amount = spot_amount; this.uuid = uuid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj AdvrSpotModel 
     */
    static async createAdvertisementSpot(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + AdvrSpotModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        const data = " " + (JSON.stringify(obj.spot_name)) + " " + (JSON.stringify(obj.spot_days)) + " " + (JSON.stringify(obj.spot_amount));
        let uu = Cryptic.hash(data);

        const spotData = {
            spot_name: obj.spot_name,
            spot_days: obj.spot_days,
            spot_amount: obj.spot_amount,
            uuid: uu
        }
        let created = null;
        try {
            created = await AdvrSpotDAO.create(spotData);
        } catch (e) {
            logger.error('Unable to Create Advertisement Spot');
            logger.error(e);
        }
        if (created) {
            return await AdvrSpotModel.getAdvertisementSpotById(created['null'])
        }
        return created;
    }


        /**
 * Utility function to get all Advertisement Spot
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
static async getAdvertisementSpot(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
    limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
    return await AdvrSpotDAO.findAll({
        order: [
            ['created_at', 'DESC']
        ],
        offset: from,
        limit: limit,
        order: [['created_at', 'DESC']],
        where: {
            isActive: true
        }
    });
}


    /**
     * Utility function to get by Spot Number
     * @param spotNumber
     * @returns any
     */
    static async getAdvertisementSpotById(spotNumber = 0) {
        return await AdvrSpotDAO.findAll({
            where: {
                spot_number: spotNumber
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


        /**
         * Utility function to update by Spot Number
         * @param spotNumber
         * @params obj
         * @returns any
         */
        static async updateSpotNumberById(spotNumber = 0, obj = null) {
            let updated = null;
            try {
                updated = await AdvrSpotDAO.update(obj, {
                    where: {
                        spot_number: spotNumber
                    }
                });
            } catch (e) {
                if (!e) {
                    updated = [1];
                } else {
                    logger.error('Unable to Update Spots');
                    logger.error(e);
                }
            }
            if (updated && updated.length && updated[0] === 1) {
                return AdvrSpotModel.getAdvertisementSpotById(spotNumber);
            } else {
                return null;
            }
        }

            /**
     * Utility function to delete by Spot Number
     * @param spotNumber
     * @returns any
     */
    static async deleteAdverSpotById(spotNumber = 0, fource = false) {
        if (!fource) {
            const del = await AdvrSpotModel.updateSpotNumberById(spotNumber, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await AdvrSpotDAO.destroy({
            where: {
                spot_number: spotNumber
            }
        });
    }


        //Operations on UUID
        static async getAdvertisementSpotByUUID(uuid = 0) {
            return await AdvrSpotDAO.findAll({
                where: {
                    uuid: uuid,
                    isActive: true
                },
                order: [
                    ['created_at', 'DESC']
                ]
            });
        }
    
    
        static async updateAdvertisementSpotByUUID(uuid = 0, obj = null) {
            let updated = null;
            try {
                updated = await AdvrSpotDAO.update(obj, {
                    where: {
                        uuid: uuid
                    }
                });
            } catch (e) {
                if (!e) {
                    updated = [1];
                } else {
                    logger.error('Unable to Update Advertisement Spot');
                    logger.error(e);
                }
            }
            if (updated && updated.length && updated[0] === 1) {
                return AdvrSpotModel.getAdvertisementSpotByUUID(uuid);
            } else {
                return null;
            }
        }

    
        static async deleteAdvertisementSpotByUUID(uuid = 0, fource = false) {
            if (!fource) {
                const del = await AdvrSpotModel.updateAdvertisementSpotByUUID(uuid, { isActive: 0 });
                return del ? 1 : 0;
            }
            return await AdvrSpotDAO.destroy({
                where: {
                    uuid: uuid
                }
            });
        }
}