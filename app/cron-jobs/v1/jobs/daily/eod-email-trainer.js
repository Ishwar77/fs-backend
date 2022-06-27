const Helper = require("../../../../utils/helper");
const EmailUtil = require("../../../../utils/emailUtils");
const EventModel = require("../../../../v1/events-module/event.model");
const CronHelper = require("../../cron-helper");
const logger = require('../../../../utils/logger');

/**
 * A report only about the Expirable events and Expirable user subscriptions to the trainer
 */

const futureDate = CronHelper.getMoment().add(1, 'days').format("YYYY-MM-DD").toString();
const futureFromDateTime = futureDate + ' 00:00:00';
const futureToDateTime = futureDate + ' 23:59:59';

module.exports = async () => {

    // 1. Expiring Events 2mro
    const expiringEventTMRO = await EventModel.getExpirableEvents(futureFromDateTime, futureToDateTime);
   // console.log('expiringEventTMRO = ', expiringEventTMRO);

    if(!expiringEventTMRO || !expiringEventTMRO.length) {
        logger.info(`No Events that are expiring b/w '${futureFromDateTime}' to '${futureToDateTime}'`)
        return;
    }

    const trainerEmails = Array.from( new Set( expiringEventTMRO.map(e => e.trainer_email) ) ) ;
    if(!trainerEmails || !trainerEmails.length) {
        logger.error(`Trainer Email was not found for expiring Events`)
        logger.info( JSON.stringify(expiringEventTMRO) );
        return;
    }

    // console.log('Unique Trainer emails = ', trainerEmails);

    // 2. Format a nice email and send to Trainers

    const emailTemplate = EmailUtil.trainerEventExpireTemplate();
        // Helper.getSenderEmailAddress()
    // "sriharsha.cr@maiora.co, ashritha.shetty@maiora.co, dhanush.kumar@maiora.co, roy.monteiro@maiora.co"
    const mail = await Helper.sendEMail(trainerEmails.join(', '),
        'The Fit Socials: An event of yours is scheduled to end', emailTemplate, emailTemplate);
    // console.log('Mail = ', mail);

    if (!mail) {
        logger.error("JOB -> EOD event expiry Report sending failed, to Trainers");
    } else {
        logger.info("JOB -> EOD event expiry Report has been sent to Trainers");
    }
};

