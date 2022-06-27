const logger = require('../../utils/logger');
const CouponDAO = require('./coupon.dao');
const MyConst = require('../utils');
const EventDAO = require('../events-module/event.dao');
const EventMasterDao = require('../event-master-module/eventmaster.dao');
const { Op, DataTypes } = require("sequelize");
const moment = require('moment');
const uuid = require('uuid-random');
const { Transaction } = require('sequelize');
const Cryptic = require('../../utils/cryptic');
const Helper = require('../../utils/helper');

module.exports = class CouponModel {

    constructor(
        title, description, image_url, event_id, discount_percent, max_discount_amount, uuid,
        expiry, usage_count, max_usage_count, created_at, updated_at, isActive = 1, isPrivate = 0
    ) {
        this.title = title; this.description = description;
        this.image_url = image_url; this.event_id = event_id;
        this.discount_percent = discount_percent; this.max_discount_amount = max_discount_amount;
        this.expiry = expiry; this.usage_count = usage_count;
        this.max_usage_count = max_usage_count; this.uuid = uuid; this.isPrivate = isPrivate;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj Coupon 
     */
    static async createCoupon(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + CouponModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        // let uu = uuid(); 
        const data = " " + (JSON.stringify(obj.title)) + " " + (JSON.stringify(obj.event_id));
        // console.log("DATA", ddd);
        let uuids = Cryptic.hash(data);
        // console.log("UUID ", uu);
        const couponData = {
            title: obj.title,
            description: obj.description,
            image_url: obj.image_url,
            event_id: obj.event_id,
            discount_percent: obj.discount_percent,
            max_discount_amount: obj.max_discount_amount,
            expiry: obj.expiry,
            usage_count: obj.usage_count,
            max_usage_count: obj.max_usage_count,
            uuid: uuids,
            isPrivate: obj.isPrivate || 0
        }
        let created = null;
        try {
            created = await CouponDAO.create(couponData);
        } catch (e) {
            logger.error('Unable to Create Coupon');
            logger.error(e);
        }

        if (created) {
            return await CouponModel.getCouponById(created['null'])
        }

        return created;
    }

    /**
     * Utility function to get all Coupon
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getCoupons(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT, showAll = false) {
        let where = { isActive: true };
        if (!showAll) {
            where = {
                [Op.and]: {
                    isActive: true,
                    isPrivate: false,
                    expiry: {
                        [Op.gte]: new Date()
                    }
                }
            };
        }

        return await CouponDAO.findAll({
            offset: from,
            limit: limit,
            order: [
                ['created_at', 'DESC']
            ],
            where: { isActive: true,  isPrivate: false},
            include: [
                {
                    model: EventDAO, as: 'Event', allowNull: true, include: [
                        { model: EventMasterDao, as: 'EventMaster', allowNull: true }
                    ]
                }
            ]
        });
    }

    static async getPrivateCoupons(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await CouponDAO.findAll({
            offset: from,
            limit: limit,
            order: [
                ['created_at', 'DESC']
            ],
            where: { isActive: true,  isPrivate: true},
            include: [
                {
                    model: EventDAO, as: 'Event', allowNull: true, include: [
                        { model: EventMasterDao, as: 'EventMaster', allowNull: true }
                    ]
                }
            ]
        });
    }

    static async getCouponByCodeAndEvent(couponCode = -1, eventId = null) {

        return await CouponDAO.findOne({
            where: { isActive: true,  title: couponCode, event_id: eventId, isPrivate: true},
            include: [
                {
                    model: EventDAO, as: 'Event', allowNull: true, include: [
                        { model: EventMasterDao, as: 'EventMaster', allowNull: true }
                    ]
                }
            ]
        });
    }

    static async getCouponsByEventId(eventId, privateCoupons = false) {
        const whr = {
            event_id: eventId,
            isActive: true,
        };

        if(privateCoupons === true) {
            whr['isPrivate'] = true
        } else if(privateCoupons === false) {
            whr['isPrivate'] = false
        }

        return await CouponDAO.findAll({
            order: [['created_at', 'DESC']],
            where: whr,
            include: [
                {
                    model: EventDAO, as: 'Event', allowNull: true, include: [
                        { model: EventMasterDao, as: 'EventMaster', allowNull: true }
                    ]
                }
            ]
        });
    }


    /**
     * Utility function to get by Id
     * @param couponid
     * @returns any
     */
    static async getCouponById(couponid = 0) {

        return await CouponDAO.findOne({
            where: {
                coupon_id: couponid,
                isActive: true
            },
            include: [
                {
                    model: EventDAO, as: 'Event', allowNull: true, include: [
                        { model: EventMasterDao, as: 'EventMaster', allowNull: true }
                    ]
                }
            ]
        });
    }

    /**
         * Utility function to update by Id
         * @param galleryId
         * @params obj
         * @returns any
         */
    static async updatCouponById(couponid = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', galleryId, obj);
        try {

            updated = await CouponDAO.update(obj, {
                where: {
                    coupon_id: couponid
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Coupon');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return await CouponModel.getCouponById(couponid);
        } else {
            return null;
        }
    }

    /**
     * Utility function to delete by Id
     * @param couponid
     * @returns any
     */
        static async deleteCouponById(couponid = 0, fource = false) {
            if (!fource) {
                const del = await CouponModel.updatCouponById(couponid, { isActive: 0 });
                return del ? 0 : 1;
            }
            return await CouponModel.destroy({
                where: {
                    coupon_id: couponid
                }
            });
        }


    //Operations on UUID
    static async getCouponByUUId(uuid = 0) {
        return await CouponDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            include: [
                {
                    model: EventDAO, as: 'Event', allowNull: true, include: [
                        { model: EventMasterDao, as: 'EventMaster', allowNull: true }
                    ]
                }
            ]
        });
    }


    static async updatCouponByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await CouponDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Coupon');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return await CouponModel.getCouponByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteCouponByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del = await CouponModel.updatCouponByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await CouponDAO.destroy({
            where: {
                uuid: uuid
            }
        });
    }

    static async updateAsTheCouponExpires(fromDateTime, toDateTime) {
        let result = null;
        const q = `UPDATE coupon
        SET coupon.isActive = 0
    WHERE coupon.expiry <= '${toDateTime}'`;
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