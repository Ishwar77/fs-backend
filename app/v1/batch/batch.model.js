const logger = require('../../utils/logger');
const BatchDAO = require('./batch.dao');
const FreequencyDAO = require('../batch-frequency-module/frequency.dao');
const MyConst = require('../utils');
const { Transaction } = require('sequelize');
const { Op } = require("sequelize");
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');
const uuid = require('uuid-random');
const SubscriptionDAO = require('../subscription/subscription.dao');
const EventDAO = require('../events-module/event.dao');
const UserDAO = require('../user-module/user.dao');

module.exports = class BatchModel {

    constructor(
        batches_id, event_id, start_time, end_time, has_limit, batch_size, frequency, frequency_config,
        available_seats, subscription_id, created_at, updated_at, isActive = 1, uuid, meeting_links
    ) {
        this.batches_id = batches_id; this.event_id = event_id; this.start_time = start_time;
        this.end_time = end_time; this.has_limit = has_limit; this.batch_size = batch_size;
        this.frequency = frequency; this.frequency_config = frequency_config; this.uuid = uuid;
        this.available_seats = available_seats; this.subscription_id = subscription_id;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive; this.meeting_links = meeting_links;
    }

    /**
* To insert into DB
* @param obj BatchModel 
*/
    static async createBatch(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + BatchModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        // let uu = uuid(); 
        const ddd = " " + (JSON.stringify(obj.event_id)) + " " + (JSON.stringify(obj.subscription_id)) + " " + (JSON.stringify(obj.start_time));
        // console.log("DATA", ddd);
        let uu = Cryptic.hash(ddd);

        const batchData = {
            event_id: obj.event_id,
            start_time: obj.start_time,
            end_time: obj.end_time,
            has_limit: obj.has_limit,
            batch_size: obj.batch_size,
            frequency: obj.frequency,
            frequency_config: obj.frequency_config,
            available_seats: obj.available_seats,
            subscription_id: obj.subscription_id,
            uuid: uu,
            meeting_links: obj.meeting_links
        }

        let created = null;
        try {
            return await BatchDAO.create(batchData);
        } catch (e) {
            logger.error('Unable to Create Batch');
            logger.error(e);
        }

        if (created) {
            return await BatchModel.getBatchById(created['null'])
        }
        return created;
    }

    /**
 * Utility function to get all Batch
 * @param from Number, record Offset, Get result from
 * @param limit Number, max number of records
 * @returns any[]
 */
    static async getBatch(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await BatchDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit,
            where: {
                isActive: true
            },
            include: [
                { model: FreequencyDAO, as: 'Frequency', allowNull: true }
            ]
        });

    }

    /**
 * Utility function to get by Batch Id
 * @param batchId
 * @returns any
 */
    static async getBatchById(batchId = 0, eventId = 0) {
        const andConditions = [
            { batches_id: batchId },
            { isActive: true }
        ];
        const whr = {
            [Op.and]: andConditions
        };

        if (eventId) {
            andConditions.push({ event_id: eventId });
        }
        return await BatchDAO.findAll({
            where: whr,
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                { model: FreequencyDAO, as: 'Frequency', allowNull: true },
                { model: EventDAO, as: 'Event', allowNull: true, include: [
                    { model: UserDAO, as: 'Instructor', allowNull: true },
                ] 
            },
                
            ]
        });

    }

    static async verifyMultipleBatches(batchIdsAry, eventId) {

        if (!batchIdsAry || !batchIdsAry.length) {
            return null;
        }

        const andConditions = [
            { isActive: true }
        ];

        if (eventId) {
            andConditions.push({ event_id: eventId });
        }

        const whr = {
            [Op.and]: andConditions,
            batches_id: {
                [Op.in]: batchIdsAry
            }
        };

        //   console.log('Whr = ', whr);

        return await BatchDAO.findAll({
            where: whr,
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                { model: FreequencyDAO, as: 'Frequency', allowNull: true }
            ]
        });
    }


    static async getBatchByEventId(eventId = 0) {
        return await BatchDAO.findAll({
            where: {
                event_id: eventId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                { model: FreequencyDAO, as: 'Frequency', allowNull: true },
                { model: SubscriptionDAO, as: 'Subscription', allowNull: true }
            ]
        });

    }

    static async getBatchBySubscriptionId(SubscriptionId = 0) {
        return await BatchDAO.findAll({
            where: {
                subscription_id: SubscriptionId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                { model: FreequencyDAO, as: 'Frequency', allowNull: true },
                { model: SubscriptionDAO, as: 'Subscription', allowNull: true }
            ]
        });

    }

    /**
     * Utility function to update by Batch Id
     * @param batchId
     * @params obj
     * @returns any
     */
    static async updateBatchById(batchId = 0, obj = null) {
        let updated = null;
        try {
            updated = await BatchDAO.update(obj, {
                where: {
                    batches_id: batchId
                }
            });

        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Batches');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return BatchModel.getBatchById(batchId);
        } else {
            return null;
        }
    }

    /**
 * Utility function to delete by Batch Id
 * @param batchId
 * @returns any
 */
    static async deleteBatchById(batchId = 0, fource = false) {
        if (!fource) {
            const del = await BatchModel.updateBatchById(batchId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await BatchDAO.destroy({
            where: {
                batches_id: batchId
            }
        });

    }

    //Operations on UUID
    static async getBatchByUUID(uuid = 0) {
        return await BatchDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                { model: FreequencyDAO, as: 'Frequency', allowNull: true }
            ]
        });
    }


    static async updateBatchByUUID(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await BatchDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Batches');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return BatchModel.getBatchByUUID(uuid);
        } else {
            return null;
        }
    }


    static async startingBatchByUUID(uuid = 0, obj) {
        let updated = null;
        try {
            updated = await BatchDAO.update(obj, {
                where: {
                    uuid: uuid,
                    isActive: true
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Progress');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return BatchModel.getBatchByUUID(uuid);
        } else {
            return null;
        }
    }


    static async deleteBatchByUUID(uuid = 0, fource = false) {
        if (!fource) {
            const del = await BatchModel.updateBatchByUUID(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await BatchDAO.destroy({
            where: {
                uuid: uuid
            }
        });
    }


    /**
     * To get the list of batches for a given trainer
     * @param {*} trainerId number
     * @param {*} days string[] day names
     * @param {*} startTime string OPTIONAL DEFAULT = '00:00'
     * @param {*} endTime string OPTIONAL DEFAULT = '23:59'
     */
    static async getTrainerBatches(trainerId, days, startTime = '00:00', endTime = '23:59') {
        let result = null;
        let q = `SELECT
        e.event_name, e.instructor_id, e.event_id, e.end_date, e.cover_image,
        b.event_id, b.batches_id, b.start_time, b.end_time, b.available_seats, b.frequency_config
        FROM event e INNER JOIN batches b ON e.event_id = b.event_id WHERE
        e.isActive = 1 AND
        b.isActive = 1 AND
        e.instructor_id = ${trainerId} AND
        b.start_time >= "${startTime}" AND b.end_time <= "${endTime}"`;

        const likeClaus = [];
        if (days && days.length) {
            days.forEach(d => {
                likeClaus.push(`b.frequency_config LIKE "%${d}%"`);
            });

            q += ' AND ' + likeClaus.join(' OR ')
        }

        q += ' ORDER BY  b.start_time';

        //   console.log('Query = ', q);
        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Trainer's Batches, using given Date Range");
            logger.error(e);
            result = [];
        }
        return result;
    }


    /**
     * To get the list of batches for a given user
     * @param {*} userId number
     * @param {*} days string[] day names
     * @param {*} startTime string OPTIONAL DEFAULT = '00:00'
     * @param {*} endTime string OPTIONAL DEFAULT = '23:59'
     */
    static async getUserBatches(userId, days, startTime = '00:00', endTime = '23:59') {

        let result = null;
        let q = `SELECT
        e.event_name,
        r.expiry_date, r.registration_id,
        rb.batch_id, rb.day_of_week, # registration_batches
        b.event_id, b.batches_id, b.start_time, b.end_time
        FROM event e, registration r, registration_batches rb, batches b

        WHERE

        e.isActive = 1 AND
        b.isActive = 1 AND

        e.event_id = r.event_id AND
        r.event_id = b.event_id AND
        r.registration_id = rb.registration_id AND
        r.user_id= ${userId} AND
        b.start_time >= "${startTime}" AND b.end_time <= "${endTime}"`;

        const likeClaus = [];
        if (days && days.length) {
            days.forEach(d => {
                likeClaus.push(`rb.day_of_week LIKE "%${d}%"`);
            });

            q += ' AND ' + likeClaus.join(' OR ')
        }

        q += ' ORDER BY  b.start_time';

        //  console.log('Query = ', q);
        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get User's Batches, using given Date Range");
            logger.error(e);
            result = [];
        }
        return result;
    }


/**
 * 
 * @param endTime string, HH:mm
 */
    static async batchesEnding(endTime) {

        let result = null;
        let q = `UPDATE batches
        SET batches.inProgress = 0 
        WHERE 
        batches.isActive = 1 AND batches.end_time = "${endTime}"`;
        try {
            const res = await Helper.dbInstance.query(q);
            // console.log(res);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Data");
            logger.error(e);
            result = [];
        }
        return result;
    }


    
/**
 * 
 * @param 
 * email_id of the Trainers
 */
static async emailAddressOfTrainer(batchId) {

    let result = null;
    let q = `SELECT user.email_id, event.event_name, batches_id, user.diaplay_name
    FROM batches
    INNER JOIN event ON batches.event_id = event.event_id
    INNER JOIN user ON event.instructor_id = user.user_id
    WHERE batches.batches_id = "${batchId}"`;
    try {
        const res = await Helper.dbInstance.query(q);
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get Data");
        logger.error(e);
        result = [];
    }
    return result;
}
}
