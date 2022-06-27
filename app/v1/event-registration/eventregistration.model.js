const logger = require('../../utils/logger');
const EventRegistrationDAO = require('./eventregistration.dao');
const MyConst = require('../utils');
const PaymentModel = require('../payment/payment.model');
const BatchRegistrationModel = require('../event-registration-batches/event-reg-batch.model');
const Helper = require('../../utils/helper');
const UserModel = require('../user-module/user.model');
const SubscriptionModel = require("../subscription/subscription.model");
const EventModel = require('../events-module/event.model');
const BatchModel = require('../batch/batch.model');
const BatchRegistrationDAO = require('../event-registration-batches/event-reg-batch.dao');
const UserDAO = require('../user-module/user.dao');
const SubscriptionDAO = require('../subscription/subscription.dao');
const UserRoleMasterDAO = require('../user-role-master/user-role-master.dao');
const AddressDAO = require('../address-module/address.dao');
const EventDao = require('../events-module/event.dao');
const Cryptic = require('../../utils/cryptic');
const CouponDao = require('../coupon-module/coupon.dao');
const EmilUtility = require('../../utils/emailUtils');
const BatchesDAO = require('../batch/batch.dao');
const CouponModel = require('../coupon-module/coupon.model');
const ceil = require('ceil');

const SubscriptionDurationUnits = {
    DAYS: 'DAY',
    WEEKS: 'WEEK',
    MONTHS: 'MONTH',
    YEARS: 'YEAR'
};

module.exports = class EventRegistrationModel {

    constructor(
        registration_id, user_id, subscription_id, status, image, created_at, updated_at, isActive = 1,
        coupon_id, final_amount, expiry_date, uuid, event_id
    ) {
        this.registration_id = registration_id; this.user_id = user_id; this.uuid = uuid;
        this.coupon_id = coupon_id; this.final_amount = final_amount; this.subscription_id = subscription_id;
        this.status = status; this.image = image; this.expiry_date = expiry_date; this.event_id = event_id;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }



    static async inczCouponCount(couponId) {
        let coupon = await CouponModel.getCouponById(couponId);
        if (coupon && coupon.usage_count < coupon.max_usage_count) {
            coupon.usage_count = coupon.usage_count + 1;
        }
        return coupon;
    }

    /**
     * To insert into DB
     * @param obj EventRegistrationModel 
     */
    static async createEventRegistration(obj) {
        if (!obj) {
            const err = "Event Registration Failed: Expecting input of type,'" + EventRegistrationModel.name;
            logger.error(err);
            logger.info('Input ' + JSON.stringify(obj));
            await EventRegistrationModel.notifyRegisterationError(null);
            return null;
        }

        //  console.log('Obj ', obj);

        // if(1 === 1) {
        //     return false;
        // }

        const checkIfAlreadySubscribedToAnEvent = await EventRegistrationModel.checkIfAlreadySubscribedToAnEvent(obj.user_id, obj.event_id);
        // console.log(checkIfAlreadySubscribedToAnEvent.length)
        if(checkIfAlreadySubscribedToAnEvent.length){
            logger.error('Already Suvscribed to this Event');
            logger.info('Input ' + JSON.stringify(obj));
            logger.info('User ' + JSON.stringify(obj.user_id));
            logger.info('Event ' + JSON.stringify(obj.event_id));
            return null;
        }

        let created = null;
        let payment = null;
        let batch = null;
        try {
            //   await Helper.dbInstance.transaction(async t => {
            // 1. Get the User
            const userObj = await UserModel.getUserById(obj.user_id);
            //  console.log('userObj = ', userObj);

            if (!userObj) {
                logger.error('Event Registration Failed: The User dont exist ');
                logger.info('Input ' + JSON.stringify(obj));
                await EventRegistrationModel.notifyRegisterationError(null, true);

                return null;
            }

            // 2. Get the Event Info
            const eventObj = await EventModel.getEventById(obj.event_id);
            if (!eventObj) {
                logger.error('Event Registration Failed: Due to bad Event Id ');
                logger.info('Input ' + JSON.stringify(obj));
                logger.info('User ' + JSON.stringify(userObj));
                await EventRegistrationModel.notifyRegisterationError(userObj, true);

                return null;
            }

            // console.log('Obj ', obj);

            // 3. Verify Batch and Seat Availability
            const batches = obj.batches;
            delete obj.batches;

            const batchIds = batches.map(b => b['batch_id']);
            // console.log('Batch Ids = ', batchIds);

            // To see if all batch Id's matches with given event id and subscription id's
            const matchingBatches = await BatchModel.verifyMultipleBatches(batchIds, obj.event_id);
            // console.log('matchingBatches = ', matchingBatches);
            // console.log('matchingBatches = ', matchingBatches.length, batchIds.length);

            // console.log('matchingBatches.length = ', matchingBatches.length);

            // Note: Manage the Selecting same batch for more than once
            if (!matchingBatches || !matchingBatches.length /* || matchingBatches.length !== batchIds.length */) {
                logger.error('Event Registration Failed: Selected Event have not matching batches');
                logger.info('Input ' + JSON.stringify(obj));
                logger.info('Event ' + JSON.stringify(eventObj));
                logger.info('User ' + JSON.stringify(userObj));
                await EventRegistrationModel.notifyRegisterationError(userObj, true);

                return null;
            }

            // seatChk
            let seatingError = false;
            matchingBatches.forEach(mb => {
                if (mb['has_limit'] === 1 && mb['available_seats'] === 0) {
                    logger.error('A batch seat limit breached');
                    logger.error('Event = ' + JSON.stringify(eventObj));
                    logger.error('Batch = ' + JSON.stringify(mb));
                    logger.error('User = ' + JSON.stringify(userObj));
                    seatingError = true;
                }
            });

            if (seatingError) {
                seatingError = false;
                logger.error('Batch Seating Error, unable to process registration');
                logger.error('Event = ' + JSON.stringify(eventObj));
                logger.error('Batch = ' + JSON.stringify(mb));
                logger.error('User = ' + JSON.stringify(userObj));
                await EventRegistrationModel.notifyRegisterationError(userObj, true);
                return null;
            }

            // 4. If Batch has limit, verify avai_sets

            // If not decz avi_seats by 1, by update call

            const subscriptionInfo = await SubscriptionModel.getSubscriptionById(obj.subscription_id, obj.event_id);
            // console.log(subscriptionInfo);
            if (!subscriptionInfo) { // -> DEPRICATED COLUMNS => !subscriptionInfo.duration || !subscriptionInfo.duration_unit
                logger.error("Invalid Subscription Id or Subscription Data for this even");
                logger.error('Event = ' + JSON.stringify(eventObj));
                logger.error('Batch = ' + JSON.stringify(mb));
                logger.error('User = ' + JSON.stringify(userObj));
                await EventRegistrationModel.notifyRegisterationError(userObj, true);

                return null;
            }

            // 5. Verify the Coupon Code
            let couponErr = false;
            let couponObj = null;
            if (obj.coupon_id) {
                // See if this coupon code is applicable for givent event
                couponObj = await CouponModel.getCouponById(obj.coupon_id);
                if (!couponObj) {
                    couponErr = true;
                    logger.info(`Invalid Coupon ID ${obj.coupon_id}`);
                    logger.info('Event = ' + JSON.stringify(eventObj));
                    logger.info('User = ' + JSON.stringify(userObj));
                }

                if(!obj['isPrivateCoupon '] && !couponObj['Event'] || couponObj['Event']['event_id'] !== obj.event_id) {
                    // This coupon is not matching with given event
                    couponErr = true;
                    logger.info(`Invalid Coupon ID ${obj.coupon_id} for the Event`);
                    logger.info('Event = ' + JSON.stringify(eventObj));
                    logger.info('User = ' + JSON.stringify(userObj));
                }

                if (!couponErr) {
                    if (couponObj['usage_count'] > couponObj['max_usage_count']) {
                        // this coupon is not applicable
                        logger.info(`Coupon Has maxed out ${obj.event_id} for the Event`);
                        logger.info('Event = ' + JSON.stringify(eventObj));
                        logger.info('User = ' + JSON.stringify(userObj));
                        await CouponModel.updatCouponById(obj.coupon_id, { isActive: false });

                        // Notify Trainer
                        await EventRegistrationModel.notifyCouponMaxOut(eventObj, couponObj);

                    } else {
                        const newUsgCount = couponObj['usage_count'] + 1;
                        const updateable = {
                            usage_count: newUsgCount
                        }

                        if (couponObj['max_usage_count'] === newUsgCount) {
                            updateable['isActive'] = false;

                            await EventRegistrationModel.notifyCouponMaxOut(eventObj, couponObj);


                        }
                        // Incz coupon usage_count
                        await CouponModel.updatCouponById(obj.coupon_id, updateable);
                    }
                }
            }

            const subscriptionAmount = await SubscriptionModel.getSubscriptionById(obj.subscription_id);

            const couponAmount = await CouponModel.getCouponById(obj.coupon_id);

            let totalAmountCal = null;

            if(!obj.coupon_id) {
                totalAmountCal = + subscriptionAmount.amount + (( + subscriptionAmount.tax *  + subscriptionAmount.amount) / 100);
                totalAmountCal = ceil(totalAmountCal);
                // console.log("TOTAL AMOUNT WITHOUT COUPON ", totalAmountCal);
            }

            if(obj.coupon_id) {
                totalAmountCal = (+ subscriptionAmount.amount - ((+ couponAmount.discount_percent * + subscriptionAmount.amount) / 100)); 
                totalAmountCal = totalAmountCal + ((+ subscriptionAmount.tax * totalAmountCal) / 100);
                totalAmountCal = ceil(totalAmountCal);
                // console.log("TOTAL AMOUNT ON APPLYING COUPON ", totalAmountCal);
            }

            // console.log ("TOTAL AMOUNT ", totalAmountCal);

            if(obj.final_amount != totalAmountCal){
                logger.error('Event Registration Failed: Mismatch in the Amount During Validation');
                logger.info('Input ' + JSON.stringify(obj));
                // console.log("Validation Of Total Amount Failed");
                return null
            }

            // 6. Verify Payable Amount
            // TODO

            //  console.log('Subsc = ', subscriptionInfo);
            const today = new Date();


            // console.log("ID ", obj.subscription_id);
            const subscriptionDays = await SubscriptionModel.getSubscriptionById(obj.subscription_id);
            // console.log("SUBS DAYS ", subscriptionDays);
            // console.log("ONLY DAYS ", subscriptionDays.days);

            // const units = subscriptionInfo.duration_unit.indexOf(SubscriptionDurationUnits.DAYS) > -1 ? SubscriptionDurationUnits.DAYS :
            //     subscriptionInfo.duration_unit.indexOf(SubscriptionDurationUnits.WEEKS) > -1 ? SubscriptionDurationUnits.WEEKS :
            //         subscriptionInfo.duration_unit.indexOf(SubscriptionDurationUnits.MONTHS) > -1 ? SubscriptionDurationUnits.MONTHS :
            //             SubscriptionDurationUnits.DAYS;
            const units = SubscriptionDurationUnits.DAYS;
            //             console.log("UNITS ", units);
            // console.log('Today = ', today,  subscriptionInfo.duration_unit.indexOf(SubscriptionDurationUnits.YEARS) );
            // console.log('Dur = ', subscriptionInfo.duration);
            // console.log('Units = ', units);
            // EXPIRY DATE CALCULATION and insertion to MySQL DB
            // const expiry = Helper.getMomentInstance()(today, "YYYY-MM-DD HH:mm:ss")
            //     .add(subscriptionInfo.duration, units.toLowerCase())
            //     .format("YYYY-MM-DD HH:mm:ss");
                const expiry = Helper.getMomentInstance()(today, "YYYY-MM-DD HH:mm:ss")
                .add(subscriptionDays.days, units.toLowerCase())
                .format("YYYY-MM-DD HH:mm:ss");

            // TODO, Event Expiry date must be greate than or equal to expiry

            obj['expiry_date'] = expiry;

            // 3. Make Registration
            created = await EventRegistrationDAO.create(obj);

            //  console.log("CREATED = ", created.null);

            batches.forEach(selectedBatch => {
                if (!selectedBatch['registration_id']) {
                    selectedBatch['registration_id'] = created.null;
                }
            });

            await BatchRegistrationModel.createMultipleBatchRegistration(batches);

            const data = " " + (JSON.stringify(obj.user_id)) + " " + (JSON.stringify(obj.rp_orderId));
            let uuids = Cryptic.hash(data);
            // 4. Insert into Payments
            const paymentObj = {
                user_id: obj.user_id,
                event_id: obj.event_id,
                subscription_id: obj.subscription_id,
                order_id: obj.rp_orderId,
                payment_id: obj.rp_paymentId,
                payment_status: obj.status || "PAID",
                signature: obj.rp_payment_response_json,
                coupon_id: obj.coupon_id,
                final_amount: obj.final_amount,
                uuid: uuids,
                registration_id: created.null
            };
            //  console.log('PaymentObj = ', paymentObj);
            payment = await PaymentModel.createPayment(paymentObj);

            if (payment) {
                // 5. Send an Email
                try {
                    await Helper.sendEMail(userObj['email_id'],
                        "You have Subscribed, for a Session with The Fit Socials",
                        EmilUtility.getEventSubscriptionTemplate(userObj, eventObj),
                        EmilUtility.getEventSubscriptionTemplate(userObj, eventObj),
                        EmilUtility.getFromAddress()
                    );
                } catch (e) {
                    logger.error('Unable to Send email');
                    logger.error(e);
                }
            }
        } catch (e) {
            logger.error('Unable to Create Event Registration');
            logger.error(e);
            await EventRegistrationModel.notifyRegisterationError(null, true);
        }
        // console.log('Post =', obj);

        if (created) {
            return await EventRegistrationModel.getEventRegistrationById(created['null']);
        }

        return created;
    }

    /**
     * Utility function to get all EventRegistration
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getEventRegistration(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await EventRegistrationDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                {
                    model: UserDAO, as: 'User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true },
                        { model: AddressDAO, as: 'Address', allowNull: true }
                    ]
                },
                {
                    model: SubscriptionDAO, as: 'Subscription', allowNull: true,
                    include: [
                        { model: EventDao, as: 'Event', allowNull: true }
                    ]
                },
                {
                    model: CouponDao, as: 'Coupon', allowNull: true
                }
            ]
        });

    }

    /**
     * Utility function to get by Event Registration Id
     * @param EventRegistrationId
     * @returns any
     */
    static async getEventRegistrationById(EventRegistrationId = 0) {

        return await EventRegistrationDAO.findAll({
            where: {
                registration_id: EventRegistrationId
            }, include: [
                {
                    model: UserDAO, as: 'User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true },
                        { model: AddressDAO, as: 'Address', allowNull: true }
                    ]
                },
                {
                    model: SubscriptionDAO, as: 'Subscription', allowNull: true,
                    include: [
                        { model: EventDao, as: 'Event', allowNull: true }
                    ]
                },
                {
                    model: CouponDao, as: 'Coupon', allowNull: true
                }
            ]
        });

    }

    /**
 * Utility function to get by Event User Id
 * @param UserId
 * @returns any
 */
    static async getEventRegistrationByUserId(UserId = 0) {

        return await EventRegistrationDAO.findAll({
            where: {
                user_id: UserId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
                model: UserDAO, as: 'User', allowNull: true,
                include: [
                    { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true },
                    { model: AddressDAO, as: 'Address', allowNull: true }
                ]
            },
            {
                model: SubscriptionDAO, as: 'Subscription', allowNull: true,
                include: [
                    { model: EventDao, as: 'Event', allowNull: true },
                    { model: BatchesDAO, as: 'Batch', allowNull: true }
                ]
            }]
        });

    }


        /**
 * Utility function to get by Event User Id
 * @param UserId
 * @returns any
 */
static async checkIfAlreadySubscribedToAnEvent(UserId = 0, EventId = 0) {

    return await EventRegistrationDAO.findAll({
        where: {
            user_id: UserId,
            event_id: EventId,
            isActive: true
        },
        order: [
            ['created_at', 'DESC']
        ]
    });

}


    /**
         * Utility function to update by Event Registration Id
         * @param EventRegistrationId
         * @params obj
         * @returns any
         */
    static async updateEventRegistrationById(EventRegistrationId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', EventRegistrationId, obj);
        try {
            updated = await EventRegistrationDAO.update(obj, {
                where: {
                    registration_id: EventRegistrationId
                }
            });

        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Event Registration');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return EventRegistrationModel.getEventRegistrationById(EventRegistrationId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Event Registration Id
     * @param EventRegistrationId
     * @returns any
     */
    static async deleteEventRegistrationById(EventRegistrationId = 0, fource = false) {
        if (!fource) {
            const del = await EventRegistrationDAO.updateEventRegistrationById(EventRegistrationId, { isActive: 0 });
            return del ? 1 : 0;
        }

        return await EventRegistrationDAO.destroy({
            where: {
                registration_id: EventRegistrationId
            }
        });
    }

    static async notifyRegisterationError(userObj, critical = false) {
        const to = userObj ? userObj['email_id'] : Helper.getSenderEmailAddress();
        // console.log("To = ", to);
        return Helper.sendEMail(to,
            "Subscription Failed, for a Session with The Fit Socials",
            EmilUtility.contactAdminForRefund(userObj),
            EmilUtility.contactAdminForRefund(userObj),
            EmilUtility.getFromAddress(),
            null,
            critical
        ).then(res => {
            //  console.log('Res = ', res);
            return true;
        }).catch(e => {
            //  console.log('Err', e);
            return false;
        });
    }


    static async notifyCouponMaxOut(eventObj, couponObj) {
        if (!eventObj || !couponObj) {
            return;
        }
        // Notify trainer
        let to = eventObj['Instructor'] ? eventObj['Instructor']['email_id'] : '';
        if (!to) {
            return;
        }

        // console.log("To = ", to);
        return Helper.sendEMail(to,
            "A Coupon has Maxed out",
            EmilUtility.couponMaxOut(couponObj['title'], eventObj['event_name']),
            EmilUtility.couponMaxOut(couponObj['title'], eventObj['event_name']),
            EmilUtility.getFromAddress()
        ).then(res => {
            //  console.log('Res = ', res);
            return true;
        }).catch(e => {
            //  console.log('Err', e);
            return false;
        });
    }


    /**
* Utility function to get by Event User Id
* @params fromDateTime
* @params toDateTime
* @returns any
*/
    static async getExpiringRegistrations(fromDateTime, toDateTime) {

        let result = null;
        const q = `SELECT
        registration.registration_id,
        registration.user_id,
        registration.uuid AS registration_uuid,
        registration.final_amount,
        user.diaplay_name,
        user.mobile_number,
        user.email_id,
        user.uuid AS user_uuid
            FROM registration
                CROSS JOIN user ON registration.user_id = user.user_id
                WHERE
                registration.expiry_date >= '${fromDateTime}' AND registration.expiry_date <= '${toDateTime}'
                AND registration.isActive = 1;`;
        // console.log('Query = ', q);
        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Registrations, using given Date Range");
            logger.error(e);
            result = [];
        }
        return result;
    }

    /**
* To get the Total amount received b/w given date range
* @params fromDateTime
* @params toDateTime
* @returns any
*/
    static async getPaymentesReceived(fromDateTime, toDateTime) {

        let result = null;
        const q = `SELECT  
        SUM(final_amount) AS total_amount
        FROM registration
            WHERE registration.created_at >= '${fromDateTime}' AND registration.created_at <= '${toDateTime}';`;
        // console.log('Query = ', q);
        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Payments received, using given Date Range");
            logger.error(e);
            result = [];
        }
        return result;
    }

    /**
    * To get the Total registrations appned b/w given date range
    * @params fromDateTime
    * @params toDateTime
    * @returns any
    */
    static async getPaymentesReceived(fromDateTime, toDateTime) {

        let result = null;
        const q = `SELECT  
    SUM(final_amount) AS total_amount
    FROM registration
        WHERE registration.created_at >= '${fromDateTime}' AND registration.created_at <= '${toDateTime}';`;
        // console.log('Query = ', q);
        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Payments received, using given Date Range");
            logger.error(e);
            result = [];
        }
        return result;
    }

    /**
    * All Client's subscriptions that are about to expire
    * @params fromDateTime
    * @params toDateTime
    * @returns any
    */
    static async getExpiringRegistrationsOfAllClients(fromDateTime, toDateTime) {

        let result = null;
        const q = `
        SELECT * FROM (
            SELECT * FROM (
                SELECT
                    registration.registration_id, registration.user_id AS client_id, registration.subscription_id, registration.final_amount, registration.expiry_date,
                    subscription.event_id AS subscribed_eventId, subscription.amount, subscription.tax
                    FROM registration INNER JOIN subscription ON subscription.subscription_id = registration.subscription_id
                ) AS registrations
            INNER JOIN event ON event.event_id = registrations.subscribed_eventId
        ) AS registered_events
        INNER JOIN user ON registered_events.client_id = user.user_id

        WHERE registered_events.expiry_date >= '${fromDateTime}' AND registered_events.expiry_date <= '${toDateTime}'
        AND registered_events.isActive = 1 AND user.isActive = 1 AND user.user_role_id = 3`;
        // console.log('Query = ', q);
        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Client's subscriptions that are about to expire, using given Date Range");
            logger.error(e);
            result = [];
        }
        return result;
    }

    /**
    * To get the Total registrations appned b/w given date range
    * @params fromDateTime
    * @params toDateTime
    * @returns any
    */
    static async updateAvailableSeatsOnEventExpiry(fromDateTime, toDateTime) {

        let result = null;
        const q = `UPDATE batches
    INNER JOIN registration ON batches.subscription_id = registration.subscription_id 
    INNER JOIN registration_batches ON  registration_batches.registration_id = registration.registration_id
    SET batches.available_seats = batches.available_seats+1
    WHERE registration.expiry_date >= '${fromDateTime}' AND registration.expiry_date <= '${toDateTime}';`;
        // console.log('Query = ', q);
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

    static async updateAsTheEventBatchExpires(fromDateTime, toDateTime) {

        let result = null;
        const q = `UPDATE registration_batches
    INNER JOIN registration ON  registration_batches.registration_id = registration.registration_id
    SET registration_batches.isActive = 0
    WHERE registration.expiry_date <= '${toDateTime}'`;
        // console.log('Query = ', q);
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

    static async updateAsTheEventSubscriptionExpires(fromDateTime, toDateTime) {

        let result = null;
        const q = `UPDATE registration
    SET registration.isActive = 0
    WHERE registration.expiry_date <= '${toDateTime}'`;
        // console.log('Query = ', q);
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