const joi = require('@hapi/joi');
const logger = require('../../utils/logger');
const GenerateOrderDAO = require('./generate-order.dao');
const MyConst = require('../utils');

module.exports = class GenerateOrderModel {

    constructor(
        order_gen_id, amount, reciptId, notes, created_at
    ) {
        this.order_gen_id = order_gen_id; this.amount = amount; this.reciptId = reciptId;
        this.notes = notes; this.created_at = created_at;
    }

        /**
 * To insert into DB
 * @param obj GenerateOrderModel 
 */
static async createGenerateOrder(obj) {
    if (!obj) {
        const err = "Expecting input of type,'" + GenerateOrderModel.name + "', recieved " + JSON.stringify(obj);
        logger.error(err);
        return null;
    }
    let created = null;
    try {
        created = await GenerateOrderDAO.create(obj);
    } catch (e) {
        logger.error('Unable to Create Orders Generated');
        logger.error(e);
    }

    if (created) {
        return await GenerateOrderModel.getGenerateOrdersById(created['null'])
    }
    return created;
}

    /**
     * Utility function to get all GenerateOrders
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getGeneratedOrders(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await GenerateOrderDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit
        });
    }

        /**
     * Utility function to get by Generated Orders Id
     * @param ordergenId
     * @returns any
     */
    static async getGenerateOrdersById(ordergenId = 0) {
        return await GenerateOrderDAO.findAll({
            where: {
                order_gen_id: ordergenId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

        /**
     * Utility function to update by Generated Orders Id
     * @param ordergenId
     * @params obj
     * @returns any
     */
    static async updateGenerateOrdersById(ordergenId = 0, obj = null) {
        let updated = null;
        try {
            updated = await GenerateOrderDAO.update(obj, {
                where: {
                    order_gen_id: ordergenId
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Generated Orders');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return GenerateOrderModel.getGenerateOrdersById(ordergenId);
        } else {
            return null;
        }
    }

        /**
     * Utility function to delete by Media Master Id
     * @param ordergenId
     * @returns any
     */
    static async deleteMediaMasterById(ordergenId = 0) {
        return await MediaMasterDAO.destroy({
            where: {
                order_gen_id: ordergenId
            }
        });
    }
}