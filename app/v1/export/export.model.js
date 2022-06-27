const logger = require('../../utils/logger');
const Helper = require('../../utils/helper');

class ExportDataModel {


    static async getAllRegistrationDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT user.diaplay_name, user.mobile_number, user.email_id,
             registration.registration_id, registration.user_id, registration.subscription_id, registration.status, 
            registration.final_amount, registration.expiry_date, registration_batches.reg_batch_id, registration_batches.batch_id, 
            registration_batches.day_of_week, batches.event_id, batches.start_time, batches.end_time, batches.batch_size, 
            batches.available_seats, batches.frequency_config, subscription.days, subscription.amount, subscription.tax, 
            event.event_name, event.description, event.instructor_id
            FROM registration 
            INNER JOIN registration_batches ON registration.registration_id = registration_batches.registration_id 
            INNER JOIN batches ON registration_batches.batch_id = batches.batches_id 
            INNER JOIN subscription ON registration.subscription_id = subscription.subscription_id 
            INNER JOIN event ON batches.event_id = event.event_id 
            INNER JOIN user ON registration.user_id = user.user_id`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }


    static async getActiveRegistrationDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT user.diaplay_name, user.mobile_number, user.email_id,
             registration.registration_id, registration.user_id, registration.subscription_id, registration.status, 
            registration.final_amount, registration.expiry_date, registration_batches.reg_batch_id, registration_batches.batch_id, 
            registration_batches.day_of_week, batches.event_id, batches.start_time, batches.end_time, batches.batch_size, 
            batches.available_seats, batches.frequency_config, subscription.days, subscription.amount, subscription.tax, 
            event.event_name, event.description, event.instructor_id
            FROM registration 
            INNER JOIN registration_batches ON registration.registration_id = registration_batches.registration_id 
            INNER JOIN batches ON registration_batches.batch_id = batches.batches_id 
            INNER JOIN subscription ON registration.subscription_id = subscription.subscription_id 
            INNER JOIN event ON batches.event_id = event.event_id 
            INNER JOIN user ON registration.user_id = user.user_id 
            WHERE registration.isActive = 1`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }


    static async getExpiredRegistrationDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT user.diaplay_name, user.mobile_number, user.email_id, event.event_name, event.description, 
            registration.registration_id, registration.user_id, registration.subscription_id, registration.status, 
            registration.final_amount, registration.expiry_date, registration_batches.reg_batch_id, registration_batches.batch_id, 
            registration_batches.day_of_week, batches.event_id, batches.start_time, batches.end_time, batches.batch_size, 
            batches.available_seats, batches.frequency_config, subscription.days, subscription.amount, subscription.tax, event.instructor_id
            FROM registration 
            INNER JOIN registration_batches ON registration.registration_id = registration_batches.registration_id 
            INNER JOIN batches ON registration_batches.batch_id = batches.batches_id 
            INNER JOIN subscription ON registration.subscription_id = subscription.subscription_id 
            INNER JOIN event ON batches.event_id = event.event_id 
            INNER JOIN user ON registration.user_id = user.user_id 
            WHERE registration.expiry_date <= CURRENT_DATE`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getAllUserDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT * FROM user`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getActiveUserDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT * FROM user WHERE isActive = 1`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getInActiveUserDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT * FROM user WHERE isActive = 0`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getAllBatchesDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`
            SELECT batches.batches_id, batches.event_id, batches.start_time, batches.end_time, batches.has_limit, batches.batch_size, 
            batches.frequency, batches.available_seats, batches.frequency_config, batches.subscription_id, event.event_name, 
            event.instructor_id, user.diaplay_name AS trainer_name, user.mobile_number, user.email_id, 
            event.cover_image, event.description, subscription.days, subscription.amount, subscription.tax, subscription.duration_unit 
            FROM batches
            INNER JOIN event ON batches.event_id = event.event_id
            INNER JOIN subscription ON batches.subscription_id = subscription.subscription_id
            INNER JOIN user ON event.instructor_id = user.user_id`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getActiveBatchesDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`
            SELECT batches.batches_id, batches.event_id, batches.start_time, batches.end_time, batches.has_limit, batches.batch_size, 
            batches.frequency, batches.available_seats, batches.frequency_config, batches.subscription_id, event.event_name, 
            event.instructor_id, user.diaplay_name AS trainer_name, user.mobile_number, user.email_id, 
            event.cover_image, event.description, subscription.days, subscription.amount, subscription.tax, subscription.duration_unit 
            FROM batches
            INNER JOIN event ON batches.event_id = event.event_id
            INNER JOIN subscription ON batches.subscription_id = subscription.subscription_id
            INNER JOIN user ON event.instructor_id = user.user_id
            WHERE batches.isActive = 1`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getInActiveBatchesDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`
            SELECT batches.batches_id, batches.event_id, batches.start_time, batches.end_time, batches.has_limit, batches.batch_size, 
            batches.frequency, batches.available_seats, batches.frequency_config, batches.subscription_id, event.event_name, 
            event.instructor_id, user.diaplay_name AS trainer_name, user.mobile_number, user.email_id, 
            event.cover_image, event.description, subscription.days, subscription.amount, subscription.tax, subscription.duration_unit 
            FROM batches
            INNER JOIN event ON batches.event_id = event.event_id
            INNER JOIN subscription ON batches.subscription_id = subscription.subscription_id
            INNER JOIN user ON event.instructor_id = user.user_id
            WHERE batches.isActive = 0`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getAllCouponDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`
            SELECT coupon.coupon_id, coupon.title, coupon.description, coupon.event_id, coupon.discount_percent, 
            coupon.max_discount_amount, coupon.expiry, coupon.usage_count, coupon.max_usage_count, coupon.isPrivate, 
            event.event_name, event.cover_image, event.description, event.instructor_id, user.diaplay_name AS trainer_name, 
            user.mobile_number, user.email_id
            FROM coupon
            INNER JOIN event ON coupon.event_id = event.event_id
            INNER JOIN user ON event.instructor_id = user.user_id`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getActiveCouponDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`
            SELECT coupon.coupon_id, coupon.title, coupon.description, coupon.event_id, coupon.discount_percent, 
            coupon.max_discount_amount, coupon.expiry, coupon.usage_count, coupon.max_usage_count, coupon.isPrivate, 
            event.event_name, event.cover_image, event.description, event.instructor_id, user.diaplay_name AS trainer_name, 
            user.mobile_number, user.email_id
            FROM coupon
            INNER JOIN event ON coupon.event_id = event.event_id
            INNER JOIN user ON event.instructor_id = user.user_id
            WHERE coupon.isActive = 1`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }


    static async getInActiveCouponDetails() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`
            SELECT coupon.coupon_id, coupon.title, coupon.description, coupon.event_id, coupon.discount_percent, 
            coupon.max_discount_amount, coupon.expiry, coupon.usage_count, coupon.max_usage_count, coupon.isPrivate, 
            event.event_name, event.cover_image, event.description, event.instructor_id, user.diaplay_name AS trainer_name, 
            user.mobile_number, user.email_id
            FROM coupon
            INNER JOIN event ON coupon.event_id = event.event_id
            INNER JOIN user ON event.instructor_id = user.user_id
            WHERE coupon.isActive = 0`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }


    static async getAllEvents() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT event.*, user.diaplay_name, user.mobile_number, user.email_id
            FROM event
            INNER JOIN user ON event.instructor_id = user.user_id`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }


    static async getEventsOnInstructorId(instructor_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT event.*, user.diaplay_name, user.mobile_number, user.email_id
            FROM event
            INNER JOIN user ON event.instructor_id = user.user_id
            WHERE event.instructor_id = ?`, { replacements: [instructor_id]});
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }


    static async getActiveEvents() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT event.*, user.diaplay_name, user.mobile_number, user.email_id
            FROM event
            INNER JOIN user ON event.instructor_id = user.user_id
            WHERE event.isActive = 1`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }


    static async getInActiveEvents() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT event.*, user.diaplay_name, user.mobile_number, user.email_id
            FROM event
            INNER JOIN user ON event.instructor_id = user.user_id
            WHERE event.isActive = 0`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }


    static async getAllAttendance() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT attendance_tracker.*, user.diaplay_name, user.email_id, user.mobile_number,
            batches.start_time, batches.end_time, event.event_name, event.cover_image
            FROM attendance_tracker 
            INNER JOIN user ON attendance_tracker.user_id = user.user_id
            INNER JOIN batches ON attendance_tracker.batch_id = batches.batches_id
            INNER JOIN event ON attendance_tracker.event_id = event.event_id`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the information");
            logger.error(e);
            result = [];
        }
        return result;
    }
}

module.exports = ExportDataModel;