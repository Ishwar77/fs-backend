const logger = require('../../utils/logger');
const AttendanceTrackerDAO = require('./attendance-tracking.dao');
const AttendancetrackerUtil = require('./attendance-tracking.util');
const userDAO = require('../user-module/user.dao');
const batchDAO = require('../batch/batch.dao');
const EventDao = require('../events-module/event.dao');
const MyConst = require('../utils');
const Batchmodel = require('../batch/batch.model');
const Cryptic = require('../../utils/cryptic');
const { Op, DataTypes } = require("sequelize");

module.exports = class AttendancetrackerModel {

    constructor(
        attendance_id, user_id,
        batch_id, day_of_week, uuid, date,
        created_at, updated_at, isActive = 1
    ) {
        this.attendance_id = attendance_id;
        this.user_id = user_id;
        this.batch_id = batch_id;
        this.date = date;
        this.day_of_week = day_of_week;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.isActive = isActive;
        this.uuid = uuid;
    }

    /**
         * To insert into DB
         * @param obj AttendanceRegistration 
         */
    static async createAttendanceTracker(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + AttendancetrackerModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        const error = AttendancetrackerUtil.getJoiValidatecreate(obj);
        if (error) {
            logger.error('Error due to bad inputs');
            logger.info('Input ' + JSON.stringify(error));
            return null;
        }
        const matchingEvents = await Batchmodel.getBatchByEventId(obj.eventId);
        if (matchingEvents.length === 0) {
            logger.error('Event doesnot Exist');
            logger.info('Input ' + JSON.stringify(matchingEvents));
            return null;
        }
        const matchingBatches = await Batchmodel.getBatchById(obj.batchId, obj.eventId);
        if (matchingBatches.length === 0) {
            logger.error('Batch doesnot Exist');
            logger.info('Input ' + JSON.stringify(matchingBatches));
            return null;
        }

        const attendance = [];
        obj.users.forEach(b => {
            attendance.push({
                batch_id: obj.batchId,
                trainer_id: obj.trainerId,
                event_id: obj.eventId,
                user_id: b,
                date: obj.date,
                uuid: Cryptic.hash(b + new Date().getTime() + '')
            })
        });

        let created = null;
        try {
            created = await AttendanceTrackerDAO.bulkCreate(attendance, { validate: true, returning: true });
        } catch (e) {
            logger.error('Unable to Register to the Attendance');
            logger.error(e);
        }

        if (created) {
            return true;
        }
        return created;
    }


    /**
* Utility function to get all Attendance
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getAttendance(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await AttendanceTrackerDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit
        });
    }


    /**
     * Utility function to get by Attendance based on batch_id
     * @param batchId
     * @returns any
     */

    static async getUsersbasedonAttendanceId(batchId = 0) {
        return await AttendanceTrackerDAO.findAll({
            where: {
                batch_id: batchId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: userDAO, as: 'User', allowNull: true
                },
                {
                    model: batchDAO, as: 'Batch', allowNull: true,
                    include: [
                        {
                            model: EventDao, as: 'Event', allowNull: true,
                        }
                    ]
                }
            ]
        });
    }

    /**
     * 
     * @param batchId
     * @param date 
     */

    static async getusersbasedonndate(batchId = 0, date = 0) {
        return await AttendanceTrackerDAO.findAll({
            where: {
                batch_id: batchId,
                created_at: {
                    [Op.gte]: moment().subtract(7, date).toDate()
                },
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: userDAO, as: 'User', allowNull: true
                },
                {
                    model: batchDAO, as: 'Batch', allowNull: true,
                    include: [
                        {
                            model: EventDao, as: 'Event', allowNull: true
                        }
                    ]
                }
            ]
        })
    }

    /**
        * 
        * @param batchId
        * @param date 
        */

    static async getdetailsbydate(batchId, fromDateTime) {
        let result = null;
        let q = `SELECT * FROM attendance_tracker WHERE created_at LIKE '%${fromDateTime}% and batch_id=${batchId}'`;

       //  console.log('Query = ', q);
        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get details");
            logger.error(e);
            result = [];
        }
        return result;
    }




    /**
    * Utility function to get by Attendance based on batch_id
    * @param uuId
    * @returns any
    */

    static async getUsersbasedonAttendanceuuId(uuId = 0) {
        return await AttendanceTrackerDAO.findAll({
            where: {
                uuid: uuId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: userDAO, as: 'User', allowNull: true
                },
                {
                    model: batchDAO, as: 'Batch', allowNull: true,
                    include: [
                        {
                            model: EventDao, as: 'Event', allowNull: true,
                        }
                    ]
                }
            ]
        });
    }


    /**
     * Utility function to update by Attendance Id
     * @param attendanceId
     * @params obj
     * @returns any
     */
    static async updateattendanceById(attendanceId = 0, obj = null) {
        let updated = null;
        try {
            updated = await AttendanceTrackerDAO.update(obj, {
                where: {
                    attendance_id: attendanceId
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Attendance');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return AttendancetrackerModel.getUsersbasedonAttendanceId(attendanceId);
        } else {
            return null;
        }
    }


    /**
 * Utility function to delete by Attendance Id
 * @param attendanceId
 * @returns any
 */
    static async deleteattendanceById(attendanceId = 0) {
        return await AttendanceTrackerDAO.destroy({
            where: {
                attendance_id: attendanceId
            }
        });
    }
}