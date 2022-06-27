const joi = require('@hapi/joi');
const logger = require('../../utils/logger');
const EventDAO = require('./event.dao');
const MyConst = require('../utils');
const EventMasterDAO = require('../event-master-module/eventmaster.dao');
const GalleryDAO = require('../gallery/gallery.dao');
const GalleryItemDao = require('../gallery-items-module/galleryitems.dao');
const InstructorDAO = require('../user-module/user.dao');
const uuid = require('uuid-random');
const { Transaction } = require('sequelize');
const Cryptic = require('../../utils/cryptic');
const Helper = require('../../utils/helper');
const { Op } = require("sequelize");
const EmailUtils = require('../../utils/emailUtils');
const UserDAO = require('../user-module/user.dao');
module.exports = class EventModel {

    constructor(
        event_id, gallery_id, event_master_id, event_name, description, cover_image, start_date,
        end_date, is_repetitive, repeat_every, start_time, end_time, price, trial_period,
        created_at, updated_at, isActive = 1, instructor_id, uuid
    ) {
        this.event_id = event_id; this.gallery_id = gallery_id; this.event_master_id = event_master_id;
        this.event_name = event_name; this.description = description; this.cover_image = cover_image;
        this.start_date = start_date; this.end_date = end_date; this.is_repetitive = is_repetitive;
        this.repeat_every = repeat_every; this.start_time = start_time, this.end_time = end_time;
        this.price = price; this.trial_period = trial_period;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
        this.instructor_id = instructor_id; this.uuid = uuid;
    }

    /**
   * To insert into DB
   * @param obj EventModel 
   */
    static async createEvent(obj) {
        // let uu = uuid(); 
        const data = " " + (JSON.stringify(obj.event_name)) + " " + (JSON.stringify(obj.description));
        let uuids = Cryptic.hash(data);
        // console.log("UUID ", uu);
        const eventData = {
            gallery_id: obj.gallery_id,
            event_master_id: obj.event_master_id,
            event_name: obj.event_name,
            description: obj.description,
            cover_image: obj.cover_image,
            start_date: obj.start_date,
            end_date: obj.end_date,
            is_repetitive: obj.is_repetitive,
            repeat_every: obj.repeat_every,
            start_time: obj.start_time,
            end_time: obj.end_time,
            price: obj.price,
            trial_period: obj.trial_period,
            instructor_id: obj.instructor_id,
            isActive: obj.isActive,
            uuid: uuids
        }
        let created = null
        try {

            created = await EventDAO.create(eventData);

        } catch (e) {
            logger.error('Unable to Create Event');
            logger.error(e);
        }
        //  console.log("DAOCreated = ", created);
        if (created) {
            const newEvent = await EventModel.getEventById(created['null'])
            await EventModel.notifyAllClientsOnNewEvent(newEvent);

            return newEvent;
        }

        return created;

    }


    /**
 * Utility function to get all Events
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
    static async getEvent(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await EventDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                { model: EventMasterDAO, as: 'EventMaster', allowNull: true },
                { model: InstructorDAO, as: 'Instructor', allowNull: true }
                // { model: GalleryDAO, as: 'Gallery', allowNull: true, include: [
                //     {model: GalleryItemDao, as: 'GalleryItem', allowNull: true}
                // ] }
            ]
        });
    }


    static async getInactiveEvent(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await EventDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: false
            },
            include: [
                { model: EventMasterDAO, as: 'EventMaster', allowNull: true },
                { model: InstructorDAO, as: 'Instructor', allowNull: true }
            ]
        });

    }


    /**
 * Utility function to get by Event Id
 * @param evntId
 * @returns any
 */
    static async getEventById(eventId = 0) {
        return await EventDAO.findOne({
            where: {
                event_id: eventId
            },
            include: [{ model: EventMasterDAO, as: 'EventMaster', allowNull: true },
            { model: InstructorDAO, as: 'Instructor', allowNull: true }]
        });
    }

    static async getBlockedEventByInstructorId(instructorId = 0) {
        return await EventDAO.findAll({
            where: {
                instructor_id: instructorId,
                isActive: false
            },
            include: [{ model: EventMasterDAO, as: 'EventMaster', allowNull: true },
            { model: InstructorDAO, as: 'Instructor', allowNull: true }]
        });
    }

    /**
* Utility function to get by Instructor Id
* @param instructorId
* @returns any
*/
    static async getEventByInstructorId(instructorId = 0) {
        return await EventDAO.findAll({
            where: {
                instructor_id: instructorId,
                isActive: true
            },
            include: [{ model: EventMasterDAO, as: 'EventMaster', allowNull: true },
            { model: InstructorDAO, as: 'Instructor', allowNull: true }]
        });
    }


    /**
     * Utility function to update by Event Id
     * @param eventId
     * @params obj
     * @returns any
     */
    static async updateEventById(eventId = 0, obj = null) {

        let updated = null;
        try {
            updated = await EventDAO.update(obj, {
                where: {
                    event_id: eventId
                }
            });
        } catch (e) {
            logger.error('Unable to Update Events');
            logger.error(e);
        }

        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return EventModel.getEventById(eventId);
        } else {
            return null;
        }
    }


    /**
  * Utility function to delete by Event Id
  * @param eventId
  * @returns any
  */
    static async deleteEventById(eventId = 0, fource = false) {
        if (!fource) {
            const del = await EventModel.updateEventById(eventId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await EventDAO.destroy({
            where: {
                event_id: eventId
            }
        });
    }


    //Operations on UUID
    static async getEventByUUId(uuid = 0) {
        return await EventDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            include: [{ model: EventMasterDAO, as: 'EventMaster', allowNull: true },
            { model: InstructorDAO, as: 'Instructor', allowNull: true }]
        });
    }

    static async updateEventByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await EventDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            logger.error('Unable to Update Events');
            logger.error(e);
        }
        if (updated && updated.length && updated[0] === 1) {
            return EventModel.getEventByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteEventByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del = await EventModel.updateEventByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await EventDAO.destroy({
            where: {
                uuid: uuid
            }
        });
    }

    static async getExpirableEvents(fromDateTime, toDateTime, trainerRole = 6) {
        let result = null;
        let q = `SELECT
        event.event_id, event.event_name, event.uuid AS Event_UUID, event.end_date, event.price, user.user_id AS trainer_id, user.diaplay_name AS trainer_name, user.email_id AS trainer_email, user.uuid AS trainer_UUID
        FROM event
        INNER JOIN user ON event.instructor_id = user.user_id
        WHERE end_time >= '${fromDateTime}' AND end_time <= '${toDateTime}'
        AND event.isActive = 1 AND user.isActive = 1 AND user.user_role_id = ${trainerRole} `;

        // console.log('Query = ', q);
        try {
            const res = await Helper.dbInstance.query(q);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Events, using given Date Range");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async notifyAllClientsOnNewEvent(eventObj) {
        if (!eventObj) {
            return;
        }
      //  console.log("eve = ", eventObj);

        const msg = EmailUtils.eventAdded(eventObj['event_name'], eventObj['description']);

        try {
            require("../all-client-mailer")("A new Fitness event is on its way", msg);
        } catch (e) {
            logger.error("Sending new Event notification to clients failed")
            logger.info(JSON.stringify(e));
        }
        return null;
    }

    static async updateAsTheEventExpires(fromDateTime, toDateTime) {
        let result = null;
        const q = `UPDATE event
        SET event.isActive = 0
    WHERE event.end_date <= '${toDateTime}'`;
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