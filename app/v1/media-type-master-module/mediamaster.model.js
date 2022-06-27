const joi = require('@hapi/joi');
const logger = require('../../utils/logger');
const MediaMasterDAO = require('./mediamaster.dao');
const MyConst = require('../utils');
const Cryptic = require('../../utils/cryptic');
const uuid = require('uuid-random');

module.exports = class MediaMasterModel {

    constructor(
        media_type_id, media_type_name, uuid, created_at, updated_at, isActive = 1,
    ) {
        this.media_type_id = media_type_id; this.media_type_name = media_type_name; this.uuid = uuid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
 * To insert into DB
 * @param obj MediaMasterModel 
 */
    static async createMediaMaster(obj) {
        if (!obj /* || obj instanceof MediaMasterModel === false */) {
            const err = "Expecting input of type,'" + MediaMasterModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        // let uu = uuid(); 
        const data = " " + (JSON.stringify(obj.media_type_name));
        let uuids = Cryptic.hash(data);
        // console.log("UUID ", uu);
        const mediaTypeData = {
            media_type_name: obj.media_type_name,
            uuid: uuids
        }
        let created = null;
        try {
            created = await MediaMasterDAO.create(mediaTypeData);
        } catch (e) {
            logger.error('Unable to Create Media Master');
            logger.error(e);
        }

        if (created) {
            return await MediaMasterModel.getMediaMasterById(created['null'])
        }

        return created;
    }


    /**
     * Utility function to get all MediaMaster
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getMediaMaster(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await MediaMasterDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit
        });
    }

    /**
     * Utility function to get by Media Master Id
     * @param mediamasterId
     * @returns any
     */
    static async getMediaMasterById(mediamasterId = 0) {
        return await MediaMasterDAO.findAll({
            where: {
                media_type_id: mediamasterId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    /**
     * Utility function to update by Media Master Id
     * @param mediamasterId
     * @params obj
     * @returns any
     */
    static async updateMediaMasterById(mediamasterId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', mediamasterId, obj);
        try {
            updated = await MediaMasterDAO.update(obj, {
                where: {
                    media_type_id: mediamasterId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Media Master');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return MediaMasterModel.getMediaMasterById(mediamasterId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Media Master Id
     * @param mediamasterId
     * @returns any
     */
    static async deleteMediaMasterById(mediamasterId = 0, fource = false) {
        if (!fource) {
            const del = await MediaMasterModel.updateMediaMasterById(mediamasterId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await MediaMasterDAO.destroy({
            where: {
                media_type_id: mediamasterId
            }
        });
    }


    //Operations on UUID
    static async getMediaMasterByUUId(uuid = 0) {
        return await MediaMasterDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async updateMediaMasterByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await MediaMasterDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Media Master');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return MediaMasterModel.getMediaMasterByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteMediaMasterByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del = await MediaMasterModel.updateMediaMasterByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await MediaMasterDAO.destroy({
            where: {
                uuid: uuid
            }
        });
    }
}