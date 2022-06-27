const logger = require('../../utils/logger');
const EventMasterDAO = require('./eventmaster.dao');
const MyConst = require('../utils');
const uuid = require('uuid-random');
const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');

module.exports = class EventMasterModel {

    constructor(
        event_master_id, event_master_name, description, image, created_at, updated_at, isActive = 1, uuid
    ) {
        this.event_master_id = event_master_id; this.event_master_name = event_master_name;
        this.description = description; this.image = image; this.uuid = uuid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj EventMasterModel 
     */
    static async createEventMaster(obj) {
        if (!obj /* || obj instanceof EventMasterModel === false */) {
            const err = "Expecting input of type,'" + EventMasterModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        // let uu = uuid(); 
        const data = " " + (JSON.stringify(obj.event_master_name));
        // console.log("DATA", ddd);
        let uuids = Cryptic.hash(data);
        // console.log("UUID ", uu);

        const eventMasterData = {
            event_master_name: obj.event_master_name,
            description: obj.description,
            image: obj.image,
            uuid: uuids
        }
        let created = null;
        try {

            return await EventMasterDAO.create(eventMasterData);
        } catch (e) {
            logger.error('Unable to Create Event Master');
            logger.error(e);
        }

        if (created) {
            return await EventMasterModel.getEventMasterById(created['null'])
        }

        return created;
    }

    /**
 * Utility function to get all EventMaster
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
    static async getEventMaster(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await EventMasterDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit
        });
    }

    /**
     * Utility function to get by Event Master Id
     * @param eventmasterId
     * @returns any
     */
    static async getEventMasterById(eventmasterId = 0) {

        return await EventMasterDAO.findAll({
            where: {
                event_master_id: eventmasterId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    /**
         * Utility function to update by Event Master Id
         * @param eventmasterId
         * @params obj
         * @returns any
         */
    static async updateEventMasterById(eventmasterId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', eventmasterId, obj);
        try {

            updated = await EventMasterDAO.update(obj, {
                where: {
                    event_master_id: eventmasterId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Event Master');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return EventMasterModel.getEventMasterById(eventmasterId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Event Master Id
     * @param eventmasterId
     * @returns any
     */
    static async deleteEventMasterById(eventmasterId = 0, fource = false) {
        if (!fource) {
            const del = await EventMasterModel.updateEventMasterById(eventmasterId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await UserModel.destroy({
            where: {
                event_master_id: eventmasterId
            }
        });
    }


    //Operations on UUID
    static async getEventMasterByUUId(uuid = 0) {
        return await EventMasterDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async updateEventMasterByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await EventMasterDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Event Master');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return EventMasterModel.getEventMasterByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteEventMasterByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del = await EventMasterModel.updateEventMasterByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await UserModel.destroy({
            where: {
                uuid: uuid
            }
        });
    }
}