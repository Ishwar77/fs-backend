const logger = require('../../utils/logger');
const BatchSwitchDAO = require('./batchswitch.dao');
const MyConst = require('../utils');
const uuid = require('uuid-random');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');
const BatchDao = require('../batch/batch.dao');
const UserDAO = require('../user-module/user.dao');
const RegistrationBatchDAO = require('../event-registration-batches/event-reg-batch.dao');
const EventRegistrationDAO = require('../event-registration/eventregistration.dao');
const BatchModel =require('../batch/batch.model');
const RegistrationBatchModel = require('../event-registration-batches/event-reg-batch.model');

module.exports = class BatchSwitchModel {

    constructor(
        batch_switch_id, user_id, registration_id, batch_id, day_of_week, uuid, reg_batch_id, 
        created_at, updated_at, isActive = 1
    ) {
        this.batch_switch_id = batch_switch_id; this.user_id = user_id; this.registration_id = registration_id;
        this.batch_id = batch_id; this.day_of_week = day_of_week; this.uuid = uuid; this.reg_batch_id = reg_batch_id;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

        /**
     * To insert into DB
     * @param obj BatchSwitchModel 
     */
    static async createBatchSwitchRequest(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + BatchSwitchModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        const data = " " + (JSON.stringify(obj.user_id)) + " " + (JSON.stringify(obj.batch_id)) + " " + (JSON.stringify(obj.registration_id));
        // console.log("DATA ", data);
        let uuids = Cryptic.hash(data);

        const batchSwitchData = {
            user_id: obj.user_id,
            registration_id: obj.registration_id,
            batch_id: obj.batch_id,
            day_of_week: obj.day_of_week,
            reg_batch_id: obj.reg_batch_id,
            uuid: uuids
        }
        let created = null;

        let seatingError = false;
        const availableSeatesCount = await BatchModel.getBatchById(obj.batch_id);
        // console.log("Available Seats ", availableSeatesCount[0].has_limit)
        // console.log("Available Seats ", availableSeatesCount[0].available_seats)
            if (availableSeatesCount[0].has_limit === 1 && availableSeatesCount[0].available_seats === 0) {
                logger.error('A batch seat limit breached');
                logger.error('Batch = ' + JSON.stringify(availableSeatesCount));
                seatingError = true;
            }
        if (seatingError) {
            seatingError = false;
            logger.error('Batch Seating Error, unable to process the Change Request');
            logger.error('Batch = ' + JSON.stringify(availableSeatesCount));
            return null;
        }


        try {

            return await BatchSwitchDAO.create(batchSwitchData);
        } catch (e) {
            logger.error('Unable to Create Batch Switch Request');
            logger.error(e);
        }

        if (created) {
            return await BatchSwitchModel.getBatchSwitchById(created['null'])
        }
        return created;
    }

        /**
 * Utility function to get all BatchSwitch
 * @param from Number, record Offset, Get result from
 * @param limit Number, max number of records
 * @returns any[]
 */
static async getBatchSwitch(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
    limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
    return await BatchSwitchDAO.findAll({
        where: {
            isActive: true
        },
        order: [
            ['created_at', 'DESC']
        ],
        offset: from,
        limit: limit,
        include: [
            { model: UserDAO, as: 'User', allowNull: true },
            { model: EventRegistrationDAO, as: 'Registration', allowNull: true },
            { model: BatchDao, as: 'Batch', allowNull: true },
            { model: RegistrationBatchDAO, as: 'RegisteredBatch', allowNull: true }, 
        ]
});
}

    /**
     * Utility function to get by Batch Switch Id
     * @param batchswitchId
     * @returns any
     */
    static async getBatchSwitchById(batchswitchId = 0) {

        return await BatchSwitchDAO.findAll({
            where: {
                batch_switch_id: batchswitchId
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                { model: UserDAO, as: 'User', allowNull: true },
                { model: EventRegistrationDAO, as: 'Registration', allowNull: true },
                { model: BatchDao, as: 'Batch', allowNull: true },
                { model: RegistrationBatchDAO, as: 'RegisteredBatch', allowNull: true }, 
            ]
        });
    }


     /**
         * Utility function to update by Batch Switch Id
         * @param batchswitchId
         * @params obj
         * @returns any
         */
        static async updateBatchSwitchById(batchswitchId = 0, obj = null) {
            let updated = null;
            try {
    
                updated = await BatchSwitchDAO.update(obj, {
                    where: {
                        batch_switch_id: batchswitchId
                    }
                });
            } catch (e) {
                if (!e) {
                    updated = [1];
                } else {
                    logger.error('Unable to Update Batch Switch Request');
                    logger.error(e);
                }
            }
            if (updated && updated.length && updated[0] === 1) {
                return BatchSwitchModel.getBatchSwitchById(batchswitchId);
            } else {
                return null;
            }
        }

            /**
     * Utility function to delete by Batch Switch Id
     * @param batchswitchId
     * @returns any
     */
    static async deleteBatchSwitchById(batchswitchId = 0, fource = false) {
        if (!fource) {
            const del = await BatchSwitchModel.updateBatchSwitchById(batchswitchId, { isActive: 0 });
            return del ? 1 : 0;
        }
        // return await UserModel.destroy({
        //     where: {
        //         batch_switch_id: batchswitchId
        //     }
        // });
    }


        //Operations on UUID
        static async getBatchSwitchByUUId(uuid = 0) {
            return await BatchSwitchDAO.findAll({
                where: {
                    uuid: uuid,
                    isActive: true
                },
                order: [
                    ['created_at', 'DESC']
                ],
                include: [
                    { model: UserDAO, as: 'User', allowNull: true },
                    { model: EventRegistrationDAO, as: 'Registration', allowNull: true },
                    { model: BatchDao, as: 'Batch', allowNull: true },
                    { model: RegistrationBatchDAO, as: 'RegisteredBatch', allowNull: true }, 
                ]
            });
        }
    
        static async updateBatchSwitchByUUId(uuid = 0, obj = null) {
            let updated = null;
            try {
                updated = await BatchSwitchDAO.update(obj, {
                    where: {
                        uuid: uuid
                    }
                });
            } catch (e) {
                if (!e) {
                    updated = [1];
                } else {
                    logger.error('Unable to Update Batch Switch');
                    logger.error(e);
                }
            }
            if (updated && updated.length && updated[0] === 1) {
                return BatchSwitchModel.getBatchSwitchByUUId(uuid);
            } else {
                return null;
            }
        }
    
        static async deleteBatchSwitchByUUId(uuid = 0, fource = false) {
            if (!fource) {
                const del = await BatchSwitchModel.updateBatchSwitchByUUId(uuid, { isActive: 0 });
                return del ? 1 : 0;
            }
            // return await UserModel.destroy({
            //     where: {
            //         uuid: uuid
            //     }
            // });
        }


             /**
         * Utility function to update by Batch Switch Id
         * @param batchswitchId
         * @params obj
         * @returns any
         */
        static async updatingTheBatchOnTrainerApproval(regbatchId = 0, obj = null) {
            let updated = null;
            try {
    
                updated = await BatchDao.update(obj, {
                    where: {
                        reg_batch_id: regbatchId
                    }
                });
            } catch (e) {
                if (!e) {
                    updated = [1];
                } else {
                    logger.error('Unable to Update Batch');
                    logger.error(e);
                }
            }
            if (updated && updated.length && updated[0] === 1) {
                return RegistrationBatchModel.getRegisteredBatchById(regbatchId);
            } else {
                return null;
            }
        }


        /**
 * 
 * @param 
 * email_id of the Trainers
 */
static async emailAddressOfUser(regbatchId) {

    let result = null;
    let q = `SELECT user.email_id, event.event_name, user.diaplay_name
    FROM registration_batches
    INNER JOIN registration ON registration_batches.registration_id = registration.registration_id
    INNER JOIN user ON registration.user_id = user.user_id
    INNER JOIN event ON registration.event_id = event.event_id
    WHERE registration_batches.reg_batch_id =  "${regbatchId}"`;
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


/**
 * 
 * @param 
 * Soft deleting the request after updation
 */
static async softDeleteRequest(regbatchId) {
    let result = null;
    let q = `UPDATE batch_switch
    SET isActive = 0
    WHERE reg_batch_id = "${regbatchId}"`;
    try {
        const res = await Helper.dbInstance.query(q);
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to Update");
        logger.error(e);
        result = [];
    }
    return result;
}



        /**
 * 
 * @param 
 * get Details On trainerID
 */
static async getDataOnTrainerID(instructorId) {
    let result = null;
    let q = `SELECT batch_switch.*, user.diaplay_name, user.mobile_number, user.email_id, user.profile_picture_url, 
    batches.event_id, batches.start_time, batches.end_time, 
    event.instructor_id, event.event_name, event.uuid AS event_uuid, event.cover_image, event.event_id, 
    registration_batches.batch_id AS current_batch_id, registration_batches.day_of_week AS current_day_of_week, 
    registration.subscription_id, registration.status, registration.final_amount, registration.expiry_date, 
    registration.created_at AS registration_created_date, registration.subscription_id, subscription.days
    FROM batch_switch
    INNER JOIN user ON batch_switch.user_id = user.user_id
    INNER JOIN batches ON batch_switch.batch_id = batches.batches_id
    INNER JOIN event ON batches.event_id = event.event_id
    INNER JOIN registration_batches ON batch_switch.reg_batch_id = registration_batches.reg_batch_id
    INNER JOIN registration ON batch_switch.registration_id = registration.registration_id
    INNER JOIN subscription ON registration.subscription_id = subscription.subscription_id
    WHERE event.instructor_id = "${instructorId}" AND batch_switch.isActive = 1
    ORDER BY batch_switch.created_at DESC`;
    try {
        const res = await Helper.dbInstance.query(q);
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to Update");
        logger.error(e);
        result = [];
    }
    return result;
}


/**
 * 
 * @param 
 * Soft deleting the request after updation
 */
static async rejectTheRequest(userId, batchId, regbatchId) {
    let result = null;
    let q = `UPDATE batch_switch
    SET isActive = 0
    WHERE user_id = "${userId}" AND batch_id = "${batchId}" AND reg_batch_id = "${regbatchId}" `;
    try {
        const res = await Helper.dbInstance.query(q);
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to Update");
        logger.error(e);
        result = [];
    }
    return result;
}
}