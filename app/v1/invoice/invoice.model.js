const joi = require('@hapi/joi');
const logger = require('../../utils/logger');
const InvoiceDAO = require('./invoice.dao');
const MyConst = require('../utils');
const PaymetsManager = require('../../utils/razorpay/paymets-manager');
const UserModel = require('../user-module/user.model');
const SubscriptionModel = require("../subscription/subscription.model");
const EventModel = require('../events-module/event.model');
const BatchModel = require('../batch/batch.model');
const BatchRegistrationModel = require('../event-registration-batches/event-reg-batch.model');
const EventRegistrationModel = require('../event-registration/eventregistration.model');
const EventRegistrationDAO = require('../event-registration/eventregistration.dao');
const CouponModel = require('../coupon-module/coupon.model');
const EmilUtility = require('../../utils/emailUtils');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');
const PaymentModel = require('../payment/payment.model');
const uuid = require('uuid-random');
const ceil = require('ceil');
const moment = require("moment");

const SubscriptionDurationUnits = {
    DAYS: 'DAY',
    WEEKS: 'WEEK',
    MONTHS: 'MONTH',
    YEARS: 'YEAR'
};

module.exports = class InvoiceModel {

    constructor(
        id, invoice_number, user_email_id, invoice_data, notes, invoice_status, created_at, updated_at,
        details
    ) {
        this.id = id; this.invoice_number = invoice_number; this.user_email_id = user_email_id;
        this.invoice_data = invoice_data; this.notes = notes; this.invoice_status = invoice_status;
        this.created_at = created_at; this.updated_at = updated_at; this.details = details;
    }

    /**
     * To insert into DB
     * @param obj InvoiceModel 
     */
    static async addInvoice(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + InvoiceModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        let created = null;
        try {

            created = await InvoiceDAO.create(obj);

        } catch (e) {
            logger.error('Unable to Add Invoice');
            logger.error(e);
        }
        if (created) {
            return await InvoiceModel.getInvoiceById(created['null'])
        }
        return created;
    }

    /**
* Utility function to get all Invoice
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getInvoice(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await InvoiceDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
        });
    }


    /**
     * Utility function to get by Invoice Id
     * @param invoiceId
     * @returns any
     */
    static async getInvoiceById(invoiceId = 0) {
        return await InvoiceDAO.findAll({
            where: {
                id: invoiceId
            }
        });
    }

    static async getInvoiceOnEmail(emailId = null) {
        return await InvoiceDAO.findAll({
            where: {
                user_email_id: emailId
            }
        });
    }


    static async getOnInvoiceStatus(invoiceStatus = null) {
        return await InvoiceDAO.findAll({
            where: {
                invoice_status: invoiceStatus
            }
        });
    }


    /**
 * Utility function to get by Invoice Number
 * @param invoiceNumber
 * @returns any
 */
    static async getInvoiceByInvoiceNumber(invoiceNumber = null) {
        return await InvoiceDAO.findAll({
            where: {
                invoice_number: invoiceNumber
            }
        });
    }


    /**
     * 
     * @param 
     * email_id of the Users whose Payment is Pending
     */
    static async getEmailIdOfPendingPaymentUsers() {

        let result = null;
        let q = `SELECT user_email_id FROM invoice WHERE invoice_status = 'issued' GROUP BY user_email_id`;
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


    static async dataOnInvoiceNumber(invoiceNumber) {

        let result = null;
        let q = `SELECT * FROM invoice WHERE invoice_number = '${invoiceNumber}'`;
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



    static async updateInvoiceByInvoiceNumber(invoiceNumber = null, obj = null) {
        let updated = null;
        // console.log('Updating, ', invoiceNumber, obj);
        try {
            updated = await InvoiceDAO.update(obj, {
                where: {
                    invoice_number: invoiceNumber
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return 'SUCCESS';
        } else {
            return 'FAILED';
        }
    }


    static async registrationWithInvoice(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + InvoiceModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        let created = null;
        try {
            let uuids = uuid();
            const creationObj = {
                customer: obj.customer,
                amount: obj.amount,
                description: obj.description,
                receipt: uuids,
                notes: obj.notes,
                type: obj.type,
                currency: obj.currency,
                sms_notify: obj.sms_notify,
                email_notify: obj.email_notify
            };
            // console.log("CREATED = ", creationObj);
            created = await PaymetsManager.createInvoice(creationObj);
            // console.log(created);
            // console.log("METADATA", JSON.stringify(created.metadata));
            // console.log("METADATA2",created.metadata.id);
            // console.log("METADATA2",created.metadata.status);
            // console.log("METADATA2",JSON.stringify(created.metadata.notes));
            // console.log("CUSTOMER", created.metadata.customer_details.email);
            const metadata = JSON.stringify(created.metadata);
            const note = JSON.stringify(created.metadata.notes);
            const data = JSON.stringify(obj);

            const today = new Date();
            // console.log("TODAY", today);
            const units = SubscriptionDurationUnits.DAYS;
            const days = 1;
            const expiry = Helper.getMomentInstance()(today, "YYYY-MM-DD HH:mm:ss")
                .add(days, units.toLowerCase()).format("YYYY-MM-DD HH:mm:ss");
            // console.log("EXPIRY ", expiry);

            const invoiceObj = {
                invoice_number: created.metadata.id,
                user_email_id: created.metadata.customer_details.email,
                invoice_data: metadata,
                notes: note,
                invoice_status: created.metadata.status,
                details: data
            };
            // console.log("INVOICE OBJECT = ", invoiceObj);
            const payment = await InvoiceModel.addInvoice(invoiceObj);
            if (payment) {
                try {
                    console.log("Successfull");
                } catch (e) {
                    logger.error('Unable to Send email');
                    logger.error(e);
                }
            }

        } catch (e) {
            logger.error('Unable to Add Invoice');
            logger.error(e);
        }
        if (created) {
            return await InvoiceModel.getInvoiceById(created['null'])
        }
        return created;
    }

    // Creating the invoice by checking all the conditions

    static async createEventInvoice(obj) {
        if (!obj) {
            const err = "Event Registration Failed: Expecting input of type,'" + EventRegistrationModel.name;
            logger.error(err);
            logger.info('Input ' + JSON.stringify(obj));
            await EventRegistrationModel.notifyRegisterationError(null);
            return null;
        }
        const checkIfAlreadySubscribedToAnEvent = await EventRegistrationModel.checkIfAlreadySubscribedToAnEvent(obj.user_id, obj.event_id);
        if (checkIfAlreadySubscribedToAnEvent.length) {
            logger.error('Already Suvscribed to this Event');
            logger.info('Input ' + JSON.stringify(obj));
            logger.info('User ' + JSON.stringify(obj.user_id));
            logger.info('Event ' + JSON.stringify(obj.event_id));
            return null;
        }
        let invoice = null
        let created = null;
        let payment = null;
        let batch = null;
        try {
            const userObj = await UserModel.getUserById(obj.user_id);
            if (!userObj) {
                logger.error('Event Registration Failed: The User dont exist ');
                logger.info('Input ' + JSON.stringify(obj));
                await EventRegistrationModel.notifyRegisterationError(null, true);

                return null;
            }
            const eventObj = await EventModel.getEventById(obj.event_id);
            if (!eventObj) {
                logger.error('Event Registration Failed: Due to bad Event Id ');
                logger.info('Input ' + JSON.stringify(obj));
                logger.info('User ' + JSON.stringify(userObj));
                await EventRegistrationModel.notifyRegisterationError(userObj, true);

                return null;
            }
            const batches = obj.batches;
            delete obj.batches;
            const batchIds = batches.map(b => b['batch_id']);
            const matchingBatches = await BatchModel.verifyMultipleBatches(batchIds, obj.event_id);
            if (!matchingBatches || !matchingBatches.length) {
                logger.error('Event Registration Failed: Selected Event have not matching batches');
                logger.info('Input ' + JSON.stringify(obj));
                logger.info('Event ' + JSON.stringify(eventObj));
                logger.info('User ' + JSON.stringify(userObj));
                await EventRegistrationModel.notifyRegisterationError(userObj, true);

                return null;
            }
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
            const subscriptionInfo = await SubscriptionModel.getSubscriptionById(obj.subscription_id, obj.event_id);
            if (!subscriptionInfo) {
                logger.error("Invalid Subscription Id or Subscription Data for this even");
                logger.error('Event = ' + JSON.stringify(eventObj));
                logger.error('Batch = ' + JSON.stringify(mb));
                logger.error('User = ' + JSON.stringify(userObj));
                await EventRegistrationModel.notifyRegisterationError(userObj, true);

                return null;
            }
            let couponErr = false;
            let couponObj = null;
            if (obj.coupon_id) {
                couponObj = await CouponModel.getCouponById(obj.coupon_id);
                if (!couponObj) {
                    couponErr = true;
                    logger.info(`Invalid Coupon ID ${obj.coupon_id}`);
                    logger.info('Event = ' + JSON.stringify(eventObj));
                    logger.info('User = ' + JSON.stringify(userObj));
                }

                if (!obj['isPrivateCoupon '] && !couponObj['Event'] || couponObj['Event']['event_id'] !== obj.event_id) {
                    couponErr = true;
                    logger.info(`Invalid Coupon ID ${obj.coupon_id} for the Event`);
                    logger.info('Event = ' + JSON.stringify(eventObj));
                    logger.info('User = ' + JSON.stringify(userObj));
                }
                if (!couponErr) {
                    if (couponObj['usage_count'] > couponObj['max_usage_count']) {
                        logger.info(`Coupon Has maxed out ${obj.event_id} for the Event`);
                        logger.info('Event = ' + JSON.stringify(eventObj));
                        logger.info('User = ' + JSON.stringify(userObj));
                        await CouponModel.updatCouponById(obj.coupon_id, { isActive: false });
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
                        await CouponModel.updatCouponById(obj.coupon_id, updateable);
                    }
                }
            }
            const subscriptionAmount = await SubscriptionModel.getSubscriptionById(obj.subscription_id);
            const couponAmount = await CouponModel.getCouponById(obj.coupon_id);
            let totalAmountCal = null;
            if (!obj.coupon_id) {
                totalAmountCal = + subscriptionAmount.amount + ((+ subscriptionAmount.tax * + subscriptionAmount.amount) / 100);
                totalAmountCal = ceil(totalAmountCal) * 100;
            }
            if (obj.coupon_id) {
                totalAmountCal = (+ subscriptionAmount.amount - ((+ couponAmount.discount_percent * + subscriptionAmount.amount) / 100));
                totalAmountCal = totalAmountCal + ((+ subscriptionAmount.tax * totalAmountCal) / 100);
                totalAmountCal = ceil(totalAmountCal) * 100;
                // console.log(totalAmountCal);
            }
            // console.log("Amount = ", totalAmountCal);

            if (obj.amount != totalAmountCal) {
                logger.error('Event Registration Failed: Mismatch in the Amount During Validation');
                logger.info('Input ' + JSON.stringify(obj));
                return null
            }
            const expiryTime = moment().add(1, 'hours').unix();
            // console.log(expiryTime);

            let uuids = uuid();
            const creationObj = {
                customer: obj.customer,
                amount: obj.amount,
                description: obj.description,
                receipt: uuids,
                notes: obj.notes,
                type: obj.type,
                expire_by: expiryTime,
                currency: obj.currency,
                sms_notify: obj.sms_notify,
                email_notify: obj.email_notify
            };
            console.log("Obj ", creationObj);
            invoice = await PaymetsManager.createInvoice(creationObj);
            const metadata = JSON.stringify(invoice.metadata);
            const note = JSON.stringify(invoice.metadata.notes);
            const data = JSON.stringify(obj);

            const today = new Date();
            // console.log("TODAY", today);
            const units = SubscriptionDurationUnits.DAYS;
            const days = 1;
            const expiry = Helper.getMomentInstance()(today, "YYYY-MM-DD HH:mm:ss")
                .add(days, units.toLowerCase()).format("YYYY-MM-DD HH:mm:ss");
            // console.log("EXPIRY ", expiry);

            const invoiceObj = {
                invoice_number: invoice.metadata.id,
                user_email_id: invoice.metadata.customer_details.email,
                invoice_data: metadata,
                notes: note,
                invoice_status: invoice.metadata.status,
                details: data
            };
            payment = await InvoiceModel.addInvoice(invoiceObj);
            // if (payment) {
            //     try {
            console.log("INVOICE SENT SUCCESSFULLY PLEASE MAKE YOUR PAYMENT");
            //     } catch (e) {
            //         logger.error('Unable to Send email');
            //         logger.error(e);
            //     }
            // }
        } catch (e) {
            logger.error('Unable to Create');
            logger.error(e);
            console.log(e);
        }
        // console.log(payment);
        // // console.log("1", payment[Invoice.dataValues.id]);
        // console.log("2", payment[dataValues.id]);
        // if (payment) {
        //     return await InvoiceModel.getInvoiceById(payment['null'])
        // }
        return payment;
    }


    //Updating the status and invoice data
    static async updateInvoiceStatus(invoiceNumber = null) {
        const status = await PaymetsManager.getInvoiceById(invoiceNumber);
        // console.log("STATUS ", status);
        const metadata = JSON.stringify(status.metadata);
        const updateable = {
            invoice_data: metadata,
            invoice_status: status.metadata.status
        }
        // console.log("UPDATABLE ", updateable);
        let updated = null;
        try {
            updated = await InvoiceDAO.update(updateable, {
                where: {
                    invoice_number: invoiceNumber
                }
            });
            // console.log(status.metadata.status);
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return 'SUCCESS';
        } else {
            return 'FAILED';
        }
    }


    // Event Subscribtion table updated after the Payment done through Invoice
    static async createEventRegistrationAfterInvoicePayment(obj) {
        if (!obj) {
            const err = "Event Registration Failed: Expecting input of type,'" + EventRegistrationModel.name;
            logger.error(err);
            logger.info('Input ' + JSON.stringify(obj));
            await EventRegistrationModel.notifyRegisterationError(null);
            return null;
        }
        let created = null;
        let payment = null;
        try {
            const status = await PaymetsManager.getInvoiceById(obj.invoiceId);
            const invoiceUpdate = await InvoiceModel.updateInvoiceStatus(obj.invoiceId);
            // console.log("UPDATED DATA", status);
            // console.log("STATUS ", status.metadata.status);


            if (status.metadata.status === "expired") {
                const getData = await InvoiceModel.dataOnInvoiceNumber(obj.invoiceId);
                // console.log("3", getData[0]);
                const getSpecificDetail = JSON.parse(getData[0].details);
                // console.log(getSpecificDetail.customer);
                // console.log(getSpecificDetail.amount);
                // console.log(getSpecificDetail.description);
                // console.log(getSpecificDetail.notes);
                // console.log(getSpecificDetail.type);
                // console.log(getSpecificDetail.currency);
                // console.log(getSpecificDetail.sms_notify);
                // console.log(getSpecificDetail.email_notify);

                const expiryTime = moment().add(1, 'hours').unix();
                let uuids = uuid();
            const creationObj = {
                customer: getSpecificDetail.customer,
                amount: getSpecificDetail.amount,
                description: getSpecificDetail.description,
                receipt: uuids,
                notes: getSpecificDetail.notes,
                type: getSpecificDetail.type,
                expire_by: expiryTime,
                currency: getSpecificDetail.currency,
                sms_notify: getSpecificDetail.sms_notify,
                email_notify: getSpecificDetail.email_notify
            };
            console.log("Obj ", creationObj);
            invoice = await PaymetsManager.createInvoice(creationObj);
            const metadata = JSON.stringify(invoice.metadata);
            const note = JSON.stringify(invoice.metadata.notes);
            const data = JSON.stringify(obj);

            const today = new Date();
            // console.log("TODAY", today);
            const units = SubscriptionDurationUnits.DAYS;
            const days = 1;
            const expiry = Helper.getMomentInstance()(today, "YYYY-MM-DD HH:mm:ss")
                .add(days, units.toLowerCase()).format("YYYY-MM-DD HH:mm:ss");
            // console.log("EXPIRY ", expiry);

            const invoiceObj = {
                invoice_number: invoice.metadata.id,
                user_email_id: invoice.metadata.customer_details.email,
                invoice_data: metadata,
                notes: note,
                invoice_status: invoice.metadata.status,
                details: data
            };
            payment = await InvoiceModel.addInvoice(invoiceObj);
            if(payment){
            console.log("INVOICE SENT SUCCESSFULLY PLEASE MAKE YOUR PAYMENT");
            } else {
                logger.error('Unable to Regenerate the Invoice');
                console.log("Unable to Regenerate the Invoice");
            }   
        }


            if (status.metadata.status === "paid") {

                const totalFinalPaidAmount = status.metadata.amount_paid/100;

                const userObj = await UserModel.getUserById(obj.user_id);
                const eventObj = await EventModel.getEventById(obj.event_id);
                const couponObj = await CouponModel.getCouponById(obj.coupon_id);
                const subsObj = await SubscriptionModel.getSubscriptionById(obj.subscription_id);
                const instructorDetais = await UserModel.getUserById(eventObj['instructor_id']);

                // console.log("COUPON title ", couponObj['title']);
                // console.log("COUPON discount_percent ", couponObj['discount_percent']);
                // console.log("SUBSCRIPTION amount ", subsObj['amount']);
                // console.log("SUBSCRIPTION tax ", subsObj['tax']);
                // console.log("Event Name ", eventObj['event_name']);
                // console.log("Event Description", eventObj['description']);
                // console.log("EVENT INSTRUCTOR ", eventObj['instructor_id']);
                // console.log("INSRUCTOR EMAIL ID", instructorDetais['email_id'])
                // console.log("User Name", userObj['diaplay_name']);
                // console.log("User Mobile Number", userObj['mobile_number']);
                // console.log("User EMAIL", userObj['email_id']);
                // console.log("INVOICE NUMBER ", obj.invoiceId);
                // console.log("Payment ID ", status.metadata.payment_id);
                // console.log("Order ID ", status.metadata.order_id);
                // console.log("Total Payed Amount ", totalFinalPaidAmount);

                const afterApplyingcouponAmount = (subsObj['amount'] - (couponObj['discount_percent'] * subsObj['amount'])/100);
                const couponAmount = subsObj['amount'] - afterApplyingcouponAmount;
                // console.log("COUPON AMOUNT", couponAmount);
                const afterApplyingCoupon = subsObj['amount'] - couponAmount;
                const taxAmount = (afterApplyingCoupon * subsObj['tax']) / 100;
                // console.log("TAX AMOUNT ", taxAmount);



                try {
                    await Helper.sendEMail(userObj['email_id'],
                        "We have recieved your Payment Successfully",
                        EmilUtility.paymentSuccessMail(obj.invoiceId, userObj['diaplay_name'], userObj['email_id'], userObj['mobile_number'], 
                        status.metadata.order_id, status.metadata.payment_id, eventObj['event_name'], eventObj['description'], 
                        subsObj['amount'], couponObj['title'], subsObj['tax'], totalFinalPaidAmount, couponObj['discount_percent'], couponAmount, taxAmount),
                        EmilUtility.paymentSuccessMail(obj.invoiceId, userObj['diaplay_name'], userObj['email_id'], userObj['mobile_number'], 
                        status.metadata.order_id, status.metadata.payment_id, eventObj['event_name'], eventObj['description'], 
                        subsObj['amount'], couponObj['title'], subsObj['tax'], totalFinalPaidAmount, couponObj['discount_percent'], couponAmount, taxAmount),
                        EmilUtility.getFromAddress());
                } catch (e) {
                    logger.error('Unable to Send email');
                    logger.error(e);
                }


                const batches = obj.batches;
                delete obj.batches;
                const batchIds = batches.map(b => b['batch_id']);
                const today = new Date();
                const subscriptionDays = await SubscriptionModel.getSubscriptionById(obj.subscription_id);
                const units = SubscriptionDurationUnits.DAYS;
                const expiry = Helper.getMomentInstance()(today, "YYYY-MM-DD HH:mm:ss")
                    .add(subscriptionDays.days, units.toLowerCase())
                    .format("YYYY-MM-DD HH:mm:ss");
                obj['expiry_date'] = expiry;
                const eventRegObj = {
                    invoiceId: obj.invoiceId,
                    user_id: obj.user_id,
                    event_id: obj.event_id,
                    subscription_id: obj.subscription_id,
                    coupon_id: obj.coupon_id,
                    isPrivateCoupon: obj.isPrivateCoupon,
                    final_amount: totalFinalPaidAmount,
                    expiry_date: expiry
                };
                // 3. Make Registration
                created = await EventRegistrationDAO.create(eventRegObj);
                batches.forEach(selectedBatch => {
                    if (!selectedBatch['registration_id']) {
                        selectedBatch['registration_id'] = created.null;
                    }
                });
                await BatchRegistrationModel.createMultipleBatchRegistration(batches);
                const signature = " " + (JSON.stringify(status.metadata.order_id)) + " " + (JSON.stringify(status.metadata.payment_id));
                const data = " " + (JSON.stringify(obj.user_id)) + " " + (JSON.stringify(obj.rp_orderId));
                let uuids = Cryptic.hash(data);
                // 4. Insert into Payments
                const paymentObj = {
                    user_id: obj.user_id,
                    event_id: obj.event_id,
                    subscription_id: obj.subscription_id,
                    order_id: status.metadata.order_id,
                    payment_id: status.metadata.payment_id,
                    payment_status: status.metadata.status || "PAID",
                    signature: obj.signature,
                    coupon_id: obj.coupon_id,
                    final_amount: status.metadata.amount_paid,
                    uuid: uuids,
                    registration_id: created.null
                };
                //  console.log('PaymentObj = ', paymentObj);
                payment = await PaymentModel.createPayment(paymentObj);

                if (payment) {
                    // 5. Send an Email
                    try {
                        await Helper.sendEMail(status.metadata.customer_details.email,
                            "You have Successfully Subscribed, for a Session with The Fit Socials",
                            EmilUtility.getEventSubscriptionTemplate(userObj, eventObj),
                            EmilUtility.getEventSubscriptionTemplate(userObj, eventObj),
                            EmilUtility.getFromAddress()
                        );
                    } catch (e) {
                        logger.error('Unable to Send email');
                        logger.error(e);
                    }
                }
            } else {
                logger.error('Your Payment is still Pending');
                console.log("Payment Pending");
            }
        } catch (e) {
            logger.error('Unable to Create Event Registration');
            logger.error(e);
            await EventRegistrationModel.notifyRegisterationError(null, true);
        }
        if (created) {
            return await EventRegistrationModel.getEventRegistrationById(created['null']);
        }
        return created;
    }
}