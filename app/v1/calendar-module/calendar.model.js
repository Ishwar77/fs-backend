const CalendarDAO = require('./calendar.dao');
const MyConst = require('../utils');

module.exports = class CalendarModel {

    constructor(
        calendar_id, event_id, created_at, updated_at, isActive = 1,
    ) {
        this.calendar_id = calendar_id; this.event_id = event_id;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj CalendarModel 
     */
    static async createCalendar(obj) {
        let created = null
        try {
            created = await CalendarDAO.create(obj);
        }  catch(e) {
            logger.error('Unable to Create Calendar');
            logger.error(e);
        }
        if (created) {
            return await CalendarModel.getCalendarById(created['null'])
        }
        return created;
    }

        /**
     * Utility function to get all Calendar
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getCalendar(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await CalendarDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit
        });
    }

    /**
     * Utility function to get by Calendar Id
     * @param calendarId
     * @returns any
     */
    static async getCalendarById(calendarId = 0) {
        return await CalendarDAO.findAll({
            where: {
                calendar_id: calendarId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }


    /**
     * Utility function to update by Calendar Id
     * @param calendarId
     * @params obj
     * @returns any
     */
    static async updateCalendarById(calendarId = 0, obj = null) {
        let updated = null;
        try {
            updated = await CalendarDAO.update(obj, {
                where: {
                    calendar_id: calendarId
                }
            });
        } catch(e) {
            logger.error('Unable to Update Calendar');
            logger.error(e);
        }
        if (updated && updated.length && updated[0] === 1) {
            return CalendarModel.getCalendarById(calendarId);
        } else {
            return null;
        }
    }

        /**
     * Utility function to delete by Calendar Id
     * @param calendarId
     * @returns any
     */
    static async deleteCalendarById(calendarId = 0, fource = false) {
        if (!fource) {
            const del =  await CalendarModel.updateCalendarById(calendarId, { isActive: 0 });
            return del ? 1 : 0;
        }

        return await CalendarDAO.destroy({
            where: {
                calendar_id: calendarId
            }
        });
    }
}