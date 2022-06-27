const joi = require('@hapi/joi');
const logger = require('../../utils/logger');
const GalleryItemDAO = require('./galleryitems.dao');
const MyConst = require('../utils');
const MediaTypeMasterDAO = require('../media-type-master-module/mediamaster.dao');
const GalleryDAO = require('../gallery/gallery.dao');

module.exports = class GalleryItemModel {

    constructor(
        gallery_item_id, gallery_id, media_type_id, media_path, created_at, updated_at, isActive = 1,
    ) {
        this.gallery_item_id = gallery_item_id; this.gallery_id = gallery_id;
        this.media_type_id = media_type_id; this.media_path = media_path;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj GalleryItemsModel 
     */
    static async createGalleryItems(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + GalleryItemModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        let created = null;
        try {
            created = await GalleryItemDAO.create(obj);
        } catch (e) {
            logger.error('Unable to Create Gallery Item');
            logger.error(e);
        }

        if (created) {
            return await GalleryItemModel.getGalleryItemById(created['null'])
        }

        return created;
    }

    /**
 * Utility function to get all GalleryItem
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
    static async getGalleryItem(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await GalleryItemDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                { model: MediaTypeMasterDAO, as: 'MediaMaster', allowNull: true },
                // { model: GalleryDAO, as: 'Gallery', allowNull: true }
            ]
        });
    }

    /**
     * Utility function to get by GalleryItem Id
     * @param galleryitemId
     * @returns any
     */
    static async getGalleryItemById(galleryitemId = 0) {
        return await GalleryItemDAO.findAll({
            where: {
                gallery_item_id: galleryitemId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    /**
         * Utility function to update by Gallery Item Id
         * @param galleryitemId
         * @params obj
         * @returns any
         */
    static async updateGalleryItemById(galleryitemId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', galleryitemId, obj);
        try {
            updated = await GalleryItemDAO.update(obj, {
                where: {
                    gallery_item_id: galleryitemId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Gallery Item');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return GalleryItemModel.getGalleryItemById(galleryitemId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Gallery Item Id
     * @param galleryitemId
     * @returns any
     */
    static async deleteGalleryItemById(galleryitemId = 0, fource = false) {
        if (!fource) {
            const del = await GalleryItemModel.updateGalleryItemById(galleryitemId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await GalleryItemDAO.destroy({
            where: {
                gallery_item_id: galleryitemId
            }
        });
    }
}