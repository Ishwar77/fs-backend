const logger = require('../../utils/logger');
const FitnessCenterDAO = require('./fitnesscenter.dao');
const MyConst = require('../utils');
const AddressDAO = require('../address-module/address.dao');
const Helper = require('../../utils/helper');
module.exports = class FitnessCenterModel {

    constructor(
        center_id, place_id, center_name, phone_number, email_id, social_links, created_at, updated_at, isActive = 1,
    ) {
        this.center_id = center_id; this.place_id = place_id; this.center_name = center_name;
        this.phone_number = phone_number; this.email_id = email_id; this.social_links = social_links;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj FitnessCenterModel 
     */
    static async createFitnessCenter(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + FitnessCenterModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        let created = null;
        try {

            created = await FitnessCenterDAO.create(obj);

        } catch (e) {
            logger.error('Unable to Create Fitness Center');
            logger.error(e);
        }

        if (created) {
            return await FitnessCenterModel.getFitnessCenterById(created['null'])
        }

        return created;
    }

    /**
 * Utility function to get all FitnessCenter
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
    static async getFitnessCenter(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await FitnessCenterDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                { model: AddressDAO, as: 'Address', allowNull: true }
            ]
        });
    }

    /**
     * Utility function to get by Fitness Center Id
     * @param fitnesscenterId
     * @returns any
     */
    static async getFitnessCenterById(fitnesscenterId = 0) {

        return await FitnessCenterDAO.findOne({
            where: {
                center_id: fitnesscenterId
            },
            include: [
                { model: AddressDAO, as: 'Address', allowNull: true }
            ]
        });
    }

    /**
         * Utility function to update by Fitness Center Id
         * @param fitnesscenterId
         * @params obj
         * @returns any
         */
    static async updateFitnessCenterById(fitnesscenterId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', fitnesscenterId, obj);
        try {

            updated = await FitnessCenterDAO.update(obj, {
                where: {
                    center_id: fitnesscenterId
                }
            });

        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Fitness Center');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return FitnessCenterModel.getFitnessCenterById(fitnesscenterId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Fitness Center Id
     * @param fitnesscenterId
     * @returns any
     */
    static async deleteFitnessCenterById(fitnesscenterId = 0, fource = false) {
        if (!fource) {
            const del = await FitnessCenterModel.updateFitnessCenterById(fitnesscenterId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await FitnessCenterDAO.destroy({
            where: {
                center_id: fitnesscenterId
            }
        });
    }
}