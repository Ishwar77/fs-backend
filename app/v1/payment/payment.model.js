const logger = require('../../utils/logger');
const PaymentDAO = require('./payment.dao');
const MyConst = require('../utils');
const UserDAO = require('../user-module/user.dao');
const SubscriptionDAO = require('../subscription/subscription.dao');
const EventDao = require('../events-module/event.dao');
const UserRoleMasterDAO = require('../user-role-master/user-role-master.dao');
const AddressDAO = require('../address-module/address.dao');
const EventRegistrationDAO = require('../event-registration/eventregistration.dao');

const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');

module.exports = class PaymentModel {

    constructor(
        slno, user_id, subscription_id, order_id, payment_id, payment_status, signature, uuid,
        created_at, updated_at, isActive = 1, registration_id, advertisement_id
    ) {
        this.slno = slno; this.user_id = user_id; this.subscription_id = subscription_id;
        this.order_id = order_id; this.payment_id = payment_id; this.registration_id = registration_id;
        this.payment_status = payment_status; this.signature = signature; this.uuid = uuid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
        this.advertisement_id = advertisement_id;
    }

    /**
     * To insert into DB
     * @param obj PaymentModel 
     */
    static async createPayment(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + PaymentModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        let created = null;
        try {
            // TODO
            // Can verify signature, before inserting into DB, for more security
            created = await PaymentDAO.create(obj);

        } catch (e) {
            logger.error('Unable to Create Payment');
            logger.error(e);
        }

        if (created) {
            return await PaymentModel.getPaymentById(created['null'])
        }

        return created;
    }

    /**
 * Utility function to get all Payment
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
    static async getPayment(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await PaymentDAO.findAll({
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
                }
            ]
        });
    }

    /**
     * Utility function to get by Payment Id
     * @param PaymentId
     * @returns any
     */
    static async getPaymentById(PaymentId = 0) {
        return await PaymentDAO.findOne({
            where: {
                slno: PaymentId
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
                }
            ]
        });
    }

    /**
         * Utility function to update by Payment Id
         * @param PaymentId
         * @params obj
         * @returns any
         */
    static async updatePaymentById(PaymentId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', PaymentId, obj);
        try {
            updated = await PaymentDAO.update(obj, {
                where: {
                    slno: PaymentId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Payment');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return await PaymentModel.getPaymentById(PaymentId);
        } else {
            return null;
        }
    }

    static async updatePaymentByRazorPayPaymentId(rpPaymentId = null, obj = null) {
        let updated = null;
        // console.log('Updating, ', PaymentId, obj);
        try {
            updated = await PaymentDAO.update(obj, {
                where: {
                    payment_id: rpPaymentId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Payment');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return 'SUCCESS';
        } else {
            return 'FAILED';
        }
    }


    /**
     * Utility function to delete by Payment Id
     * @param PaymentId
     * @returns any
     */
    static async deletePaymentById(PaymentId = 0, fource = false) {
        if (!fource) {
            const del = await PaymentModel.updatePaymentById(PaymentId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await PaymentDAO.destroy({
            where: {
                slno: PaymentId
            }
        });
    }


        /**
     * Utility function to get by User Id
     * @param UserId
     * @returns any
     */
    static async getUserTransactionListById(UserId = 0) {
        return await PaymentDAO.findAll({
            where: {
                user_id: UserId
            },
            include: [
                {
                    model: UserDAO, as: 'User', allowNull: true
                },
                {
                    model: SubscriptionDAO, as: 'Subscription', allowNull: true,
                    include: [
                        { model: EventDao, as: 'Event', allowNull: true }
                    ]
                },
                {
                    model: EventRegistrationDAO, as: 'Registration', allowNull: true,
                }
            ]
        });
    }
}