const joi = require('@hapi/joi');
const logger = require('../../utils/logger');
const AdvertisementDAO = require('./advertisement.dao');
const MyConst = require('../utils');
const Cryptic = require('../../utils/cryptic');
const PaymentModel = require('../payment/payment.model');
const Helper = require('../../utils/helper');

const AdvertisementUnits = {
    DAYS: 'DAY',
    WEEKS: 'WEEK',
    MONTHS: 'MONTH',
    YEARS: 'YEAR'
};

module.exports = class AdvertisementModel {

    constructor(
        advertisement_id, advertisement_title, advertisement_description, advertisement_image, 
        advertisement_start_date, advertisement_end_time, advertisement_spot, addvertising_days,
        trainer_id, created_at, updated_at, isActive = 1, uuid, amount_paid
    ) {
        this.advertisement_id = advertisement_id; this.advertisement_title = advertisement_title;
        this.advertisement_description = advertisement_description; this.addvertising_days = addvertising_days;
        this.advertisement_image = advertisement_image; this.advertisement_start_date = advertisement_start_date;
        this.advertisement_end_time = advertisement_end_time; this.advertisement_spot = advertisement_spot;
        this.trainer_id = trainer_id; this.uuid = uuid; this.amount_paid = amount_paid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

        /**
     * To insert into DB
     * @param obj AdvertisementModel 
     */
    static async createAdvertisement(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + AdvertisementModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        const data = " " + (JSON.stringify(obj.advertisement_title)) + " " + (JSON.stringify(obj.advertisement_image)) + " " + (JSON.stringify(obj.advertisement_description));
        let uu = Cryptic.hash(data);

        const advertisementData = {
            advertisement_title: obj.advertisement_title, 
            advertisement_description: obj.advertisement_description, 
            advertisement_image: obj.advertisement_image, 
            advertisement_start_date: obj.advertisement_start_date, 
            advertisement_end_time: obj.advertisement_end_time, 
            advertisement_spot: obj.advertisement_spot, 
            trainer_id: obj.trainer_id,
            amount_paid: obj.amount_paid,
            addvertising_days: obj.addvertising_days,
            uuid: uu
        }
        let created = null;
        try {
            created = await AdvertisementDAO.create(advertisementData);
        } catch (e) {
            logger.error('Unable to Create Advertisement');
            logger.error(e);
        }
        if (created) {
            return await AdvertisementModel.getAdvertisementById(created['null'])
        }
        return created;
    }


            /**
 * Utility function to get all Advertisement
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
static async getAdvertisement(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
    limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
    return await AdvertisementDAO.findAll({
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
     * Utility function to get by Advertisement ID
     * @param advertisementId
     * @returns any
     */
    static async getAdvertisementById(advertisementId = 0) {
        return await AdvertisementDAO.findAll({
            where: {
                advertisement_id: advertisementId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    //     /**
    //  * Utility function to get by Advertisement ID
    //  * @param advertisementId
    //  * @returns any
    //  */
    static async getAdvertisementOnSpotAndDate(spotId, currentDate) {
        return await AdvertisementDAO.findAll({
            where: {
                advertisement_spot: spotId,
                advertisement_start_date: currentDate,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

        /**
         * Utility function to update by Advertisement ID
         * @param advertisementId
         * @params obj
         * @returns any
         */
        static async updateAdvertisementById(advertisementId= 0, obj = null) {
            let updated = null;
            try {
                updated = await AdvertisementDAO.update(obj, {
                    where: {
                        advertisement_id: advertisementId
                    }
                });
            } catch (e) {
                if (!e) {
                    updated = [1];
                } else {
                    logger.error('Unable to Update Advertisement');
                    logger.error(e);
                }
            }
            if (updated && updated.length && updated[0] === 1) {
                return AdvertisementModel.getAdvertisementById(advertisementId);
            } else {
                return null;
            }
        }

            /**
     * Utility function to delete by Advertisement ID
     * @param advertisementId
     * @returns any
     */
    static async deleteAdvertisementById(advertisementId= 0, fource = false) {
        if (!fource) {
            const del = await AdvertisementModel.updateAdvertisementById(advertisementId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await AdvertisementDAO.destroy({
            where: {
                advertisement_id: advertisementId
            }
        });
    }


        //Operations on UUID
        static async getAdvertisementByUUID(uuid = 0) {
            return await AdvertisementDAO.findAll({
                where: {
                    uuid: uuid,
                    isActive: true
                },
                order: [
                    ['created_at', 'DESC']
                ]
            });
        }
    
    
        static async updateAdvertisementByUUID(uuid = 0, obj = null) {
            let updated = null;
            try {
                updated = await AdvertisementDAO.update(obj, {
                    where: {
                        uuid: uuid
                    }
                });
            } catch (e) {
                if (!e) {
                    updated = [1];
                } else {
                    logger.error('Unable to Update Advertisement');
                    logger.error(e);
                }
            }
            if (updated && updated.length && updated[0] === 1) {
                return AdvertisementModel.getAdvertisementByUUID(uuid);
            } else {
                return null;
            }
        }

    
        static async deleteAdvertisementByUUID(uuid = 0, fource = false) {
            if (!fource) {
                const del = await AdvertisementModel.updateAdvertisementByUUID(uuid, { isActive: 0 });
                return del ? 1 : 0;
            }
            return await AdvertisementDAO.destroy({
                where: {
                    uuid: uuid
                }
            });
        }


            /**
     * To insert into DB
     * @param obj  AdvertisementModel
     */
    static async createAdvertisementWithPayment(obj) {
        if (!obj) {
            const err = "Advertisement Creation Failed: Expecting input of type,'" + AdvertisementModel.name;
            logger.error(err);
            return null;
        }

        const today = obj.advertisement_start_date;
        const units = AdvertisementUnits.DAYS;
        const advertisement_end_time = Helper.getMomentInstance()(today, "YYYY-MM-DD HH:mm:ss")
        .add(obj.addvertising_days, units.toLowerCase())
        .format("YYYY-MM-DD HH:mm:ss");
        obj['advertisement_end_time'] = advertisement_end_time;

        const data = " " + (JSON.stringify(obj.advertisement_title)) + " " + (JSON.stringify(obj.advertisement_image)) + " " + (JSON.stringify(obj.advertisement_description));
        let uu = Cryptic.hash(data);

        const advertisementData = {
            advertisement_title: obj.advertisement_title, 
            advertisement_description: obj.advertisement_description, 
            advertisement_image: obj.advertisement_image, 
            advertisement_start_date: obj.advertisement_start_date, 
            advertisement_end_time: obj.advertisement_end_time, 
            advertisement_spot: obj.advertisement_spot, 
            trainer_id: obj.trainer_id,
            amount_paid: obj.amount_paid,
            addvertising_days: obj.addvertising_days,
            uuid: uu
        }
        let created = null;
        let payment = null;
        try {
            // 3. Make Registration
            created = await AdvertisementDAO.create(advertisementData);
            //  console.log("CREATED = ", created.null);
            const data = " " + (JSON.stringify(obj.trainer_id)) + " " + (JSON.stringify(obj.rp_orderId));
            let uuids = Cryptic.hash(data);
            // 4. Insert into Payments
            const paymentObj = {
                user_id: obj.trainer_id,
                order_id: obj.rp_orderId,
                payment_id: obj.rp_paymentId,
                payment_status: obj.status || "PAID",
                signature: obj.rp_payment_response_json,
                uuid: uuids,
                advertisement_id: created.null
            };
            //  console.log('PaymentObj = ', paymentObj);
            payment = await PaymentModel.createPayment(paymentObj);
        } catch (e) {
            logger.error('Unable to Create Advertisement');
            logger.error(e);
        }
        // console.log('Post =', obj);
        if (created) {
            return await AdvertisementModel.getAdvertisementById(created['null']);
        }
        return created;
    }


    // static async getActiveAdvertisementsOnSpots(addSpotId, fromDateTime) {
    //     let result = null;
    //     const q = `SELECT * FROM advertisement WHERE advertisement_spot = '${addSpotId}' AND advertisement_start_date <= "${fromDateTime}" AND isActive = 1`;
    //     console.log("QUERY ", q);
    //     try {
    //         const res = await Helper.dbInstance.query(q);
    //         result = (res && res.length) ? res[0] : [];
    //     } catch (e) {
    //         logger.error("Unable to get the Data for the given Inputs");
    //         logger.error(e);
    //         result = [];
    //     }
    //     return result;
    // }

    static async updateAsTheAdvertiseExpires(fromDateTime, toDateTime) {
        let result = null;
        const q = `UPDATE advertisement
        SET advertisement.isActive = 0
    WHERE advertisement.advertisement_end_time <= '${toDateTime}'`;
        console.log('Query = ', q);
        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to Update, using given Date Range");
            logger.error(e);
            result = [];
        }
        return result;
    }
}