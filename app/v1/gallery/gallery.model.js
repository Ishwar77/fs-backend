const joi = require('@hapi/joi');
const logger = require('../../utils/logger');
const GalleryDAO = require('./gallery.dao');
const MyConst = require('../utils');
const EventDAO = require('../events-module/event.dao');
const EventMasterDao = require('../event-master-module/eventmaster.dao');

module.exports = class GalleryModel {

    constructor(
        gallery_id, event_id, created_at, updated_at, isActive = 1,
    ) {
        this.gallery_id = gallery_id; this.event_id;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj Gallery 
     */
    static async createGallery(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + GalleryModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        let created = null;
        try {
            created = await GalleryDAO.create(obj);
        } catch (e) {
            logger.error('Unable to Create Gallery');
            logger.error(e);
        }

        if (created) {
            return await GalleryModel.getGalleryById(created['null'])
        }

        return created;
    }

    /**
 * Utility function to get all Gallery
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
    static async getGallery(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await GalleryDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                {
                    model: EventDAO, as: 'Event', allowNull: true, include: [
                        // {model: EventMasterDao, as: 'EventMaster', allowNull: true}
                    ]
                }
            ]
        });
    }

    /**
     * Utility function to get by Gallery Id
     * @param galleryId
     * @returns any
     */
    static async getGalleryById(galleryId = 0) {
        return await GalleryDAO.findAll({
            where: {
                gallery_id: galleryId
            },
            include: [
                { model: EventDAO, as: 'Event', allowNull: true }
            ]
        });
    }

    /**
         * Utility function to update by Gallery Id
         * @param galleryId
         * @params obj
         * @returns any
         */
    static async updateGalleryById(galleryId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', galleryId, obj);
        try {
            updated = await GalleryDAO.update(obj, {
                where: {
                    gallery_id: galleryId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Gallery');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return GalleryModel.getGalleryById(galleryId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Gallery Id
     * @param galleryId
     * @returns any
     */
    static async deleteGalleryById(galleryId = 0, fource = false) {
        if (!fource) {
            const del = await GalleryModel.updateGalleryById(galleryId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await GalleryDAO.destroy({
            where: {
                gallery_id: galleryId
            }
        });
    }
}