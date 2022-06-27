const Helper = require("../../../../utils/helper");
const EmailUtil = require("../../../../utils/emailUtils");
const EventRegistrationModel = require("../../../../v1/event-registration/eventregistration.model");
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
    const expiringEventTMRO = await EventRegistrationModel.getExpiringRegistrationsOfAllClients(futureFromDateTime, futureToDateTime);
   // console.log('expiringEventTMRO = ', expiringEventTMRO);

    if(!expiringEventTMRO || !expiringEventTMRO.length) {
        logger.info(`No Events that are expiring b/w '${futureFromDateTime}' to '${futureToDateTime}'`)
        return;
    }

    const clientEmails = Array.from( new Set( expiringEventTMRO.map(e => e.email_id) ) ) ;
    if(!clientEmails || !clientEmails.length) {
        logger.error(`Client Email was not found for expiring Events`)
        logger.info( JSON.stringify(expiringEventTMRO) );
        return;
    }

   // console.log('Client Emails = ', clientEmails);

    // 2. Format a nice email and send to Trainers

    const emailTemplate = EmailUtil.clientRegistrationExpiryNotification();

    // "sriharsha.cr@maiora.co, ashritha.shetty@maiora.co, dhanush.kumar@maiora.co, roy.monteiro@maiora.co"
    const mail = await Helper.sendEMail(clientEmails.join(', '),
        'The Fit Socials: A subscription is about to end', emailTemplate, emailTemplate);
    // console.log('Mail = ', mail);

    if (!mail) {
        logger.error("JOB -> EOD event expiry Report sending failed, to Client");
    } else {
        logger.info("JOB -> EOD event expiry Report has been sent to Client");
    }
};

