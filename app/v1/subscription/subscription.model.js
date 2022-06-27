const logger = require('../../utils/logger');
const SubscriptionDAO = require('./subscription.dao');
const MyConst = require('../utils');
const EventDao = require('../events-module/event.dao');
const EventMasterDao = require('../event-master-module/eventmaster.dao');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');
const { Op } = require("sequelize");
const EmailUtils = require('../../utils/emailUtils');
module.exports = class SubscriptionModel {

    constructor(
        subscription_id, event_id, days, amount, tax, batch_count, duration, duration_unit = 'DAYS',
        created_at, updated_at, isActive = 1, uuid
    ) {
        this.subscription_id = subscription_id; this.event_id = event_id;
        this.days = days; this.amount = amount; this.tax = tax; this.batch_count = batch_count;
        this.duration = duration; this.duration_unit = duration_unit || 'DAYS'; this.uuid = uuid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj SubscriptionModel 
     */
    static async createSubscription(obj) {
        if (!obj /* || obj instanceof SubscriptionModel === false */) {
            const err = "Expecting input of type,'" + SubscriptionModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        // let uu = uuid(); 
        const data = " " + (JSON.stringify(obj.event_id)) + " " + (JSON.stringify(obj.days)) + " " + (JSON.stringify(obj.amount));
        let uuids = Cryptic.hash(data);
        // console.log("UUID ", uu);

        const subscriptionData = {
            event_id: obj.event_id,
            days: obj.days,
            amount: obj.amount,
            tax: obj.tax,
            batch_count: obj.batch_count,
            duration: obj.duration,
            duration_unit: obj.duration_unit,
            uuid: uuids
        }
        let created = null;
        try {

            return await SubscriptionDAO.create(subscriptionData);
        } catch (e) {
            logger.error('Unable to Create Subscription');
            logger.error(e);
        }

        if (created) {
            const newSubscr = await SubscriptionModel.getSubscriptionById(created['null']);

            if (newSubscr && !newSubscr['amount'] || newSubscr['amount'] < 1) {
                await EventModel.notifyAllClientsOnFreeSubscription(newSubscr);
            }

            return newSubscr;

        }

        return created;
    }

    /**
 * Utility function to get all Subscription
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
    static async getSubscription(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await SubscriptionDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                {
                    model: EventDao, as: 'Event', allowNull: true, include: [
                        { model: EventMasterDao, as: 'EventMaster', allowNull: true }
                    ]
                }
            ]
        });
    }

    /**
     * Utility function to get by Subscription Id
     * @param SubscriptionId
     * @param eventId OPTIONAL
     * @returns any
     */
    static async getSubscriptionById(SubscriptionId = 0, eventId = 0) {

        const whr = !eventId || eventId < 1 ? { subscription_id: SubscriptionId } : {
            [Op.and]: [
                { subscription_id: SubscriptionId },
                { event_id: eventId }
            ]
        };

        return await SubscriptionDAO.findOne({
            where: whr,
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: EventDao, as: 'Event', allowNull: true, include: [
                        { model: EventMasterDao, as: 'EventMaster', allowNull: true }
                    ]
                }
            ]
        });
    }

    /**
 * Utility function to get by Event Id
 * @param EventId
 * @returns any
 */
    static async getSubscriptionByEventId(EventId = 0) {
        return await SubscriptionDAO.findAll({
            where: {
                event_id: EventId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

/**
* Get Subscriptions of a trainer by price
*/
    static async getTrainersSubscriptionsByPrice(trainerId = -1, price = 0) {
        let result = null;
        let q = `SELECT
        e.event_name, e.uuid AS event_uuid, e.event_id AS event_id,
        s.days AS subscription_days, s.tax AS subscription_tax, s.amount AS subscription_amount
        FROM event e

        INNER JOIN subscription s ON e.event_id = s.event_id

        WHERE
        e.isActive = 1 AND
        s.isActive = 1 AND

        s.amount = ${price} AND
        e.instructor_id = ${trainerId}`;

        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Subscriptions");
            logger.error(e);
            result = [];
        }
        return result;
    }

    /**
         * Utility function to update by Subscription Id
         * @param SubscriptionId
         * @params obj
         * @returns any
         */
    static async updateSubscriptionById(SubscriptionId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', SubscriptionId, obj);
        try {
            updated = await SubscriptionDAO.update(obj, {
                where: {
                    subscription_id: SubscriptionId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Subscription');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return SubscriptionModel.getSubscriptionById(SubscriptionId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Subscription Id
     * @param SubscriptionId
     * @returns any
     */
    static async deleteSubscriptionById(SubscriptionId = 0, fource = false) {
        if (!fource) {
            const del = await SubscriptionModel.updateSubscriptionById(SubscriptionId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await SubscriptionDAO.destroy({
            where: {
                subscription_id: SubscriptionId
            }
        });
    }


    //Operations on UUID
    static async getSubscriptionByUUId(uuid = 0) {
        return await SubscriptionDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: EventDao, as: 'Event', allowNull: true, include: [
                        { model: EventMasterDao, as: 'EventMaster', allowNull: true }
                    ]
                }
            ]
        });
    }


    static async updateSubscriptionByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await SubscriptionDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Subscription');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return SubscriptionModel.getSubscriptionByUUId(uuid);
        } else {
            return null;
        }
    }


    static async deleteSubscriptionByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del = await SubscriptionModel.updateSubscriptionByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await SubscriptionDAO.destroy({
            where: {
                uuid: uuid
            }
        });
    }

    static async notifyAllClientsOnFreeSubscription(eventObj) {

        // This shall be implemented on demand, so that no user will miss use this info

        //     if (!eventObj) {
        //         return;
        //     }
        //   //  console.log("eve = ", eventObj);

        //     const msg = EmailUtils.eventAdded(eventObj['event_name'], eventObj['description']);

        //     try {
        //         require("../all-client-mailer")("A new Free Subscription has been added", msg);
        //     } catch (e) {
        //         logger.error("Sending new Event notification to clients failed")
        //         logger.info(JSON.stringify(e));
        //     }
        //     return null;
    }

}