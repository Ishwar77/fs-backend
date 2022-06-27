const logger = require('../../utils/logger');
const EventRegistrationDAO = require('../event-registration/eventregistration.dao');
const MyConst = require('../utils');
const Helper = require('../../utils/helper');
const DBUtil = require("../../utils/config");

class JoinModel {


    static async getAllDetails(user_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query('SELECT registration.registration_id, registration.user_id, registration.subscription_id, subscription.event_id, registration.status, subscription.days, subscription.amount, subscription.tax, event.gallery_id, event.event_master_id, event.event_name, event.description, event.cover_image, event.start_date, event.end_date, event.is_repetitive, event.repeat_every, event.start_time, event.end_time, event.price, event.trial_period, user.diaplay_name, user.mobile_number, user.email_id, user.profile_picture_url, user.referral_code, user.gender, registration_batches.*, batches.start_time AS batch_start_time, batches.end_time AS batch_end_time FROM registration INNER JOIN subscription ON registration.subscription_id = subscription.subscription_id INNER JOIN event ON subscription.event_id = event.event_id INNER JOIN user ON registration.user_id = user.user_id INNER JOIN registration_batches ON registration.registration_id = registration_batches.registration_id INNER JOIN batches ON registration_batches.batch_id = batches.batches_id WHERE registration.user_id = ? AND registration.isActive = 1', { replacements: [user_id] });
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get User's Subscription info");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getAllPaymentDetails() {
        let result = null;

        try {
            const res = await Helper.dbInstance.query(`SELECT registration.*, user.*, subscription.*, event.*, event.uuid AS event_uuid, payment.*, registration_batches.reg_batch_id, 
            registration_batches.batch_id, registration_batches.day_of_week, batches.* 
            FROM registration 
            INNER JOIN user ON user.user_id = registration.user_id 
            INNER JOIN subscription ON subscription.subscription_id = registration.subscription_id 
            INNER JOIN event ON event.event_id = subscription.event_id 
            INNER JOIN payment ON registration.registration_id = payment.registration_id 
            INNER JOIN registration_batches ON registration.registration_id = registration_batches.registration_id 
            INNER JOIN batches ON registration_batches.batch_id = batches.batches_id 
            GROUP BY registration.registration_id`);
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get User's Subscription info");
            logger.error(e);
            result = [];
        }
    }


    static async getTrainerRegisteredUserWhoareActive(instructor_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT registration.*, user.*, subscription.*, event.*, payment.*, registration_batches.reg_batch_id, 
            registration_batches.batch_id, registration_batches.day_of_week, batches.*, event.uuid AS event_uuid
            FROM registration 
            INNER JOIN user ON user.user_id = registration.user_id 
            INNER JOIN subscription ON subscription.subscription_id = registration.subscription_id 
            INNER JOIN event ON event.event_id = subscription.event_id 
            INNER JOIN payment ON registration.registration_id = payment.registration_id 
            INNER JOIN registration_batches ON registration.registration_id = registration_batches.registration_id 
            INNER JOIN batches ON registration_batches.batch_id = batches.batches_id 
            WHERE registration.isActive = 1 AND event.instructor_id = ?
            GROUP BY registration.registration_id
            `, { replacements: [instructor_id] });
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get User's Subscription info");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getInactiveUserTrainerRegisteredUser(instructor_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(' SELECT registration.*, user.*, subscription.*, event.*, payment.*, registration_batches.reg_batch_id, registration_batches.batch_id, registration_batches.day_of_week, batches.* FROM registration INNER JOIN user ON user.user_id = registration.user_id INNER JOIN subscription ON subscription.subscription_id = registration.subscription_id INNER JOIN event ON event.event_id = subscription.event_id INNER JOIN payment ON registration.registration_id = payment.registration_id INNER JOIN registration_batches ON registration.registration_id = registration_batches.registration_id INNER JOIN batches ON registration_batches.batch_id = batches.batches_id WHERE registration.isActive = 0 AND event.instructor_id = ? GROUP BY registration.registration_id', { replacements: [instructor_id] });
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get User's Subscription info");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getUsersForTrainerAndParticularEvent(event_id, instructor_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query('SELECT registration.*, user.*, subscription.*, event.* FROM registration INNER JOIN user ON user.user_id = registration.user_id INNER JOIN subscription ON subscription.subscription_id = registration.subscription_id INNER JOIN event ON event.event_id = subscription.event_id WHERE event.event_id = ? AND event.instructor_id = ? AND registration.isActive = 1', { replacements: [event_id, instructor_id]});
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get User's Subscription info");
            logger.error(e);
            result = [];
        }
        return result;
    }


    static async usersListforanEvent(event_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT registration.*, user.*, subscription.*, event.* 
            FROM registration 
            INNER JOIN user ON user.user_id = registration.user_id 
            INNER JOIN subscription ON subscription.subscription_id = registration.subscription_id 
            INNER JOIN event ON event.event_id = subscription.event_id 
            WHERE event.event_id = ? AND registration.isActive = 1
            `, { replacements: [event_id]});
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get User's Subscription info");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getAllReviews() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query('select review.*, event.event_name, event.description, event.cover_image, user.diaplay_name, user.profile_picture_url, user.designation from review inner join event on event.event_id = review.event_id inner join user on user.user_id = review.user_id order by created_at desc');
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get The Reviews");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async AllUsersDetailonEventID(event_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query(`SELECT registration.*, user.*, subscription.*, event.*, payment.* 
            FROM registration 
            INNER JOIN user ON user.user_id = registration.user_id 
            INNER JOIN subscription ON subscription.subscription_id = registration.subscription_id 
            INNER JOIN event ON event.event_id = subscription.event_id 
            INNER JOIN payment ON registration.registration_id = payment.registration_id
            WHERE event.event_id = ?`, { replacements: [event_id] });
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get The Details");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getTestimoniesOnEventId(event_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query('select review.*, event.event_name, event.description, event.cover_image, user.diaplay_name, user.profile_picture_url, user.designation from review inner join event on review.event_id = event.event_id inner join user on review.user_id = user.user_id where review.event_id = ? order by created_at desc;', { replacements: [event_id] });
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Reviews");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async activeCounts() {
        let result = null;
        try {
            const res = await Helper.dbInstance.query('SELECT (SELECT COUNT(diaplay_name) FROM user WHERE isActive = 1 and user_role_id = 6) as Number_Of_Active_Trainers, (SELECT COUNT(diaplay_name) FROM user WHERE isActive = 1 and user_role_id = 3) as Number_Of_Active_Users, (SELECT COUNT(event_name) FROM event WHERE isActive = 1) as Number_Of_Active_Events, (SELECT COUNT(subscription_id) FROM subscription WHERE isActive = 1) as Number_Of_Active_Subscriptions, (SELECT COUNT(coupon_id) FROM coupon WHERE isActive = 1)  as Number_Of_Active_Coupons, (SELECT COUNT(review_id) FROM review WHERE isActive = 1) as Number_Of_Active_Reviews, (SELECT COUNT(referral_id) FROM user_referrals WHERE isActive = 1) as Number_Of_Active_Referrals;');
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the Counts");
            logger.error(e);
            result = [];
        }
        return result;
    }
    

    static async getNumberOfSubscribedEvent(user_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query('SELECT (SELECT COUNT(user_id) FROM registration WHERE isActive = 1 and user_id = ?) as Number_Of_Subscribed_Events;', { replacements: [user_id] });
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the count of Subscribed event of this user");
            logger.error(e);
            result = [];
        }
        return result;
    }


    static async getTrainerActiveEvents(instructor_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query('SELECT (SELECT COUNT(event_id) FROM event WHERE isActive = 1 and instructor_id = ?) as Number_Of_Trainer_Active_Events;', { replacements: [instructor_id] });
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get Active Events Of this Trainer");
            logger.error(e);
            result = [];
        }
        return result;
    }

    static async getPayment(instructor_id) {
        let result = null;
        try {
            const res = await Helper.dbInstance.query('SELECT payment.*, user.*, subscription.*, event.* FROM payment INNER JOIN user ON payment.user_id = user.user_id INNER JOIN subscription ON payment.subscription_id = subscription.subscription_id INNER JOIN event ON subscription.event_id = event.event_id WHERE event.instructor_id = ?', { replacements: [instructor_id] });
            result = (res && res.length) ? res[0] : [];
        } catch (e) {
            logger.error("Unable to get the Payment Details");
            logger.error(e);
            result = [];
        }
        return result;
    }


// // Total Amount recieved, for all events
// SELECT  SUM(`final_amount`) AS `total_amount_recieved` FROM registration
// // Average amount paid per client
// SELECT  AVG(`final_amount`) AS `total_amount_recieved` FROM registration
// // Number of Subscribers and Average amount per subscriber
// SELECT COUNT(`registration_id`) AS `subscribers_count` ,  AVG(`final_amount`) AS `total_amount_recieved` FROM registration

static async getTopEvents() {
    let result = null;
    try {
        const res = await Helper.dbInstance.query('SELECT event.event_id, event.uuid, event.event_name, event.description, event.cover_image, event.instructor_id, COUNT(registration.subscription_id) AS subscribers FROM `event`, registration, subscription WHERE registration.subscription_id = subscription.subscription_id AND subscription.event_id = event.event_id AND registration.isActive = 1 GROUP BY event.event_name ORDER BY subscribers DESC;');
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get the Events List");
        logger.error(e);
        result = [];
    }
    return result;
}

static async getHighestUsers() {
    let result = null;
    try {
        const res = await Helper.dbInstance.query('SELECT user.diaplay_name, user.profile_picture_url, COUNT(registration.user_id) AS subscribers FROM `user`, registration WHERE registration.user_id = user.user_id GROUP BY  registration.user_id;');
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get the Users List");
        logger.error(e);
        result = [];
    }
    return result;
}


static async getPeakTrainers() {
    let result = null;
    try {
        const res = await Helper.dbInstance.query('SELECT event.instructor_id, user.diaplay_name, user.pageName, user.profile_picture_url, COUNT(registration.subscription_id) AS subscribers FROM `event`, user, registration, subscription WHERE registration.subscription_id = subscription.subscription_id AND subscription.event_id = event.event_id AND event.instructor_id = user.user_id AND registration.isActive = 1 GROUP BY user.user_id ORDER BY subscribers DESC;');
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get the Trainers List");
        logger.error(e);
        result = [];
    }
    return result;
}

static async getCountOfPayment(instructor_id) {
    let result = null;
    try {
        const res = await Helper.dbInstance.query('SELECT (SELECT COUNT(payment_id) FROM payment INNER JOIN subscription ON payment.subscription_id = subscription.subscription_id INNER JOIN event ON subscription.event_id = event.event_id WHERE payment.isActive = 1 and event.instructor_id = ?) as Number_Of_Active_Payments', { replacements: [instructor_id] });
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get the Payment List");
        logger.error(e);
        result = [];
    }
    return result;
}


static async getReviewCount(instructor_id) {
    let result = null;
    try {
        const res = await Helper.dbInstance.query('SELECT (SELECT COUNT(review_id) FROM review INNER JOIN event ON review.event_id = event.event_id INNER JOIN user ON event.instructor_id = user.user_id WHERE review.isActive = 1 and event.instructor_id = ?) as Number_Of_Active_Reviews;', { replacements: [instructor_id] });
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get the Review Count");
        logger.error(e);
        result = [];
    }
    return result;
}


static async getBatchAndSubscription(event_id) {
    let result = null;
    try {
        const res = await Helper.dbInstance.query('SELECT subscription.*, batches.* FROM subscription INNER JOIN batches ON subscription.subscription_id = batches.subscription_id WHERE subscription.event_id = ? AND batches.available_seats > 0', { replacements: [event_id] });
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get the Details");
        logger.error(e);
        result = [];
    }
    return result;
}


static async getUniqueBatchesOnInstructor(instructor_id) {
    let result = null;
    try {
        const res = await Helper.dbInstance.query('SELECT batches.*, event.* FROM batches INNER JOIN event ON event.event_id = batches.event_id WHERE batches.start_time >= CURRENT_TIME() AND batches.isActive = 1 AND event.instructor_id = ? GROUP BY batches.start_time', { replacements: [instructor_id] });
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get the Batch Details");
        logger.error(e);
        result = [];
    }
    return result;
}

static async getNextBatchTimeandDetails(user_id) {
    let result = null;
    try {
        const res = await Helper.dbInstance.query('SELECT registration_batches.*, batches.*, registration.*, event.* FROM registration_batches INNER JOIN batches ON registration_batches.batch_id = batches.batches_id INNER JOIN registration ON registration_batches.registration_id = registration.registration_id INNER JOIN event ON registration.event_id = event.event_id WHERE registration.isActive = 1 AND batches.start_time >= CURRENT_TIME() AND registration.user_id = ?', { replacements: [user_id] });
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get the Details");
        logger.error(e);
        result = [];
    }
    return result;
}

static async getUserTransactionListById(user_id) {
    let result = null;
    try {
        const res = await Helper.dbInstance.query(`SELECT payment.*, 
        user.diaplay_name, user.mobile_number, user.email_id, user.profile_picture_url, user.pageName,
        registration.final_amount, registration.expiry_date, registration_batches.reg_batch_id, registration_batches.day_of_week, 
        subscription.days, subscription.amount, subscription.tax, subscription.batch_count, 
        subscription.duration, subscription.duration_unit,
        batches.batches_id, batches.start_time, batches.end_time, batches.has_limit, 
        batches.batch_size, batches.frequency, batches.available_seats, batches.frequency_config,
        event.event_id, event.event_name, event.description, event.cover_image, event.uuid as event_uuid
        FROM payment
        INNER JOIN user ON payment.user_id = user.user_id
        INNER JOIN registration ON payment.registration_id = registration.registration_id
        INNER JOIN subscription ON payment.subscription_id = subscription.subscription_id
        INNER JOIN registration_batches ON registration.registration_id = registration_batches.registration_id
        INNER JOIN batches ON registration_batches.batch_id = batches.batches_id
        INNER JOIN event ON subscription.event_id = event.event_id
        WHERE user.user_id = ?`, { replacements: [user_id] });
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get the Details");
        logger.error(e);
        result = [];
    }
    return result;
}

static async batchregistemailid(batch_id) {
    let result = null;
    try {
        const res = await Helper.dbInstance.query(`SELECT user.email_id, event.event_name
        FROM registration_batches
        INNER JOIN registration ON registration_batches.registration_id = registration.registration_id
        INNER JOIN user ON registration.user_id = user.user_id
        INNER JOIN event ON registration.event_id = event.event_id
        WHERE registration_batches.isActive = 1 AND registration_batches.batch_id = ?
        GROUP BY user.email_id
        `, { replacements: [batch_id] });
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get Email-IDs");
        logger.error(e);
        result = [];
    }
    return result;
}

static async listOfAtendees(batchId, date) {
    let result = null;
    try {
        const res = await Helper.dbInstance.query(`SELECT user.*, batches.*, event.*
        FROM attendance_tracker
        INNER JOIN user ON attendance_tracker.user_id = user.user_id
        INNER JOIN batches ON attendance_tracker.batch_id = batches.batches_id
        INNER JOIN event ON attendance_tracker.event_id = event.event_id
        WHERE attendance_tracker.batch_id = ? AND attendance_tracker.date = ?
        `, { replacements: [batchId, date] });
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get Data on Give Date");
        logger.error(e);
        result = [];
    }
    return result;
}


static async advertise(addSpotId, fromDateTime) {
    let result = null;
    try {
        const res = await Helper.dbInstance.query(`SELECT * FROM advertisement 
        WHERE advertisement_spot = ? AND advertisement_start_date <= ?
        AND isActive = 1
        `, { replacements: [addSpotId, fromDateTime] });
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get Data on Give Date");
        logger.error(e);
        result = [];
    }
    return result;
}

static async addUpdateWhenExpired(fromDateTime, toDateTime) {
    let result = null;
    try {
        const res = await Helper.dbInstance.query(`UPDATE advertisement
        SET advertisement.isActive = 0
    WHERE advertisement.advertisement_end_time <= ?
        `, { replacements: [toDateTime] });
        result = (res && res.length) ? res[0] : [];
    } catch (e) {
        logger.error("Unable to get Data on Give Date");
        logger.error(e);
        result = [];
    }
    return result;
}
}
module.exports = JoinModel;