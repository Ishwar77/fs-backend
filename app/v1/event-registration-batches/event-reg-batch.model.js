const logger = require('../../utils/logger');
const RegistrationBatchDAO = require('./event-reg-batch.dao');
const MyConst = require('../utils');
const RegistrationDAO = require('../event-registration/eventregistration.dao');
const UserDAO = require('../user-module/user.dao');
const BatchDAO = require('../batch/batch.dao');
const { Op, DataTypes } = require("sequelize");
const moment = require('moment');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');

module.exports = class RegistrationBatchModel {

    constructor(
        reg_batch_id, registration_id, batch_id, day_of_week, created_at, updated_at, isActive = 1, uuid
    ) {
        this.reg_batch_id = reg_batch_id; this.registration_id = registration_id;
        this.batch_id = batch_id; this.day_of_week = day_of_week; this.uuid = uuid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
         * To insert into DB
         * @param obj BatchRegistration 
         */
    static async createBatchRegistration(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + RegistrationBatchModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        let created = null;
        try {
            created = await RegistrationBatchDAO.create(obj);
        } catch (e) {
            logger.error('Unable to Register to the Batch');
            logger.error(e);
        }

        if (created) {
            return await RegistrationBatchModel.getRegisteredBatchById(created['null'])
        }

        return created;
    }


    /**
* Utility function to get all Registered Batches
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getRegiteredBatches(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await RegistrationBatchDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit
        });
    }


    /**
 * Utility function to get by Registered Batches Id
 * @param regbatchId
 * @returns any
 */
    static async getRegisteredBatchById(regbatchId = 0) {

        return await RegistrationBatchDAO.findAll({
            where: {
                reg_batch_id: regbatchId
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
                model: BatchDAO, as: 'Batch', allowNull: true
            },
            {
                model: RegistrationDAO, as: 'Registration', allowNull: true, include: [
                    {
                        model: UserDAO, as: 'User', allowNull: true
                    }
                ]
            }]
        });
    }

    /**
     * Utility function to get by Registered based on batch_id
     * @param regbatchId
     * @returns any
     */

    static async getUsersbasedonbatchId(regbatchId = 0) {
        return await RegistrationBatchDAO.findAll({
            where: {
                batch_id: regbatchId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
                model: BatchDAO, as: 'Batch', allowNull: true
            },
            {
                model: RegistrationDAO, as: 'Registration', allowNull: true, include: [
                    {
                        model: UserDAO, as: 'User', allowNull: true
                    }
                ]
            }]
        });
    }


    static async getdetailsOnRegistrationId(regId = 0, batchId = 0) {
        return await RegistrationBatchDAO.findAll({
            where: {
                registration_id: regId,
                batch_id: batchId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    static async getdetailsOnlyOnRegId(regId = 0) {
        return await RegistrationBatchDAO.findAll({
            where: {
                registration_id: regId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
                model: BatchDAO, as: 'Batch', allowNull: true
            }]
        });
    }


    /**
     * Utility function to update by Registered Batch Id
     * @param regbatchId
     * @params obj
     * @returns any
     */
    static async updateRegisteredBatchById(regbatchId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', regbatchId, obj);
        try {

            updated = await RegistrationBatchDAO.update(obj, {
                where: {
                    reg_batch_id: regbatchId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Registered Batches');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return RegistrationBatchModel.getRegisteredBatchById(regbatchId);
        } else {
            return null;
        }
    }


    /**
 * Utility function to delete by Registered Batch Id
 * @param regbatchId
 * @returns any
 */
    static async deleteRegisteredBatchById(regbatchId = 0) {

        return await RegistrationBatchDAO.destroy({
            where: {
                reg_batch_id: regbatchId
            }
        });
    }

    /**
     * To insert into DB
     * @param obj BatchRegistration 
     */
    static async createMultipleBatchRegistration(obj) {
        if (!obj || !obj.length) {
            const err = "Expecting input of type,'" + RegistrationBatchModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        let created = null;
        try {
            created = await RegistrationBatchDAO.bulkCreate(obj, { validate: true, returning: true });
        } catch (e) {
            logger.error('Unable to Register to the Batch');
            logger.error(e);
        }

        if (created) {
            return true;
        }

        return created;
    }

    //Operations on UUID
    static async getRegisteredBatchByUUId(uuid = 0) {
        return await RegistrationBatchDAO.findAll({
            where: {
                uuid: uuid
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async updateRegisteredBatchByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {

            updated = await RegistrationBatchDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Registered Batches');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return RegistrationBatchModel.getRegisteredBatchByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteRegisteredBatchByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del = await RegistrationBatchModel.updateRegisteredBatchByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await RegistrationBatchDAO.destroy({
            where: {
                uuid: uuid
            }
        });
    }
}