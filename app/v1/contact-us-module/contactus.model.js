const logger = require('../../utils/logger');
const ContactUsDAO = require('./contactus.dao');
const MyConst = require('../utils');

const { Transaction } = require('sequelize');
const Helper = require('../../utils/helper');

module.exports = class ContactUsModel {

    constructor(
        contact_id, full_name, email, mobile_number, subject, message, created_at, updated_at, isActive = 1,
    ) {
        this.contact_id = contact_id; this.full_name = full_name; this.email = email;
        this.mobile_number = mobile_number; this.subject = subject; this.message = message;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj ContactUsModel 
     */
    static async createContactUs(obj) {
        if (!obj /* || obj instanceof ContactUsModel === false */) {
            const err = "Expecting input of type,'" + ContactUsModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        let created = null;
        try {

            return await ContactUsDAO.create(obj);
        } catch (e) {
            logger.error('Unable to Create Contact Us');
            logger.error(e);
        }

        if (created) {
            return await ContactUsModel.getContactUsById(created['null'])
        }

        return created;
    }

    /**
 * Utility function to get all ContactUs
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
    static async getContactUs(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {


        return await ContactUsDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit
        });
    }

    /**
     * Utility function to get by Contact Us Id
     * @param ContactUsId
     * @returns any
     */
    static async getContactUsById(ContactUsId = 0) {

        return await ContactUsDAO.findAll({
            where: {
                contact_id: ContactUsId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    /**
         * Utility function to update by Contact Us Id
         * @param ContactUsId
         * @params obj
         * @returns any
         */
    static async updateContactUsById(ContactUsId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', ContactUsId, obj);
        try {
            updated = await ContactUsDAO.update(obj, {
                where: {
                    contact_id: ContactUsId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Contact Us');
                logger.error(e);
            }
        }
        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return ContactUsModel.getContactUsById(ContactUsId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Contact Us Id
     * @param ContactUsId
     * @returns any
     */
    static async deleteContactUsById(ContactUsId = 0, fource = false) {
        if (!fource) {
            const del = await ContactUsModel.updateContactUsById(ContactUsId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await ContactUsDAO.destroy({
            where: {
                contact_id: ContactUsId
            }
        });
    }
}