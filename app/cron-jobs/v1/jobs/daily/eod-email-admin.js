const Helper = require("../../../../utils/helper");
const EmailUtil = require("../../../../utils/emailUtils");
const EventModel = require("../../../../v1/events-module/event.model");
const EventRegistrationModel = require("../../../../v1/event-registration/eventregistration.model");
const UsereModel = require("../../../../v1/user-module/user.model");
const CronHelper = require("../../cron-helper");
const logger = require('../../../../utils/logger');
const CouponModel = require("../../../../v1/coupon-module/coupon.model");
const JoinModel = require("../../../../v1//join/join.model");
const InvoiceModel = require("../../../../v1/invoice/invoice.model");
const EmailUtils = require('../../../../utils/emailUtils');
/**
 * A report on Total Registrations, Payments, Expirable events will be sent to Admin
 */

const futureDate = CronHelper.getMoment().add(1, 'days').format("YYYY-MM-DD").toString();
const futureFromDateTime = futureDate + ' 00:00:00';
const futureToDateTime = futureDate + ' 23:59:59';

const currentDate = CronHelper.getMoment().format("YYYY-MM-DD").toString();
const currentFromDateTime = currentDate + ' 00:00:00';
const currenToDateTime = currentDate + ' 23:59:59';



module.exports = async () => {

    // 1. Expiring Events 2mro
    const expiringEventTMRO = await EventModel.getExpirableEvents(futureFromDateTime, futureToDateTime);
    //  console.log('expiringEventTMRO = ', expiringEventTMRO);

    // 2. Registrations Expiring 2mro
    const expiringRegistrationsTMRO = await EventRegistrationModel.getExpiringRegistrations(futureFromDateTime, futureToDateTime);
    //   console.log('expiringRegistrationsTMRO = ', expiringRegistrationsTMRO);

    // 3. Payments recieved today
    const paymentsGotToday = await EventRegistrationModel.getPaymentesReceived(currentFromDateTime, currenToDateTime);
    //  console.log('paymentsGotToday = ', paymentsGotToday);

    // 4. User Signup's happened today
    const usersSignedupToday = await UsereModel.getUserSignedUpBetween(currentFromDateTime, currenToDateTime);
    //   console.log('usersSignedupToday = ', usersSignedupToday);

    // 5. Availbale Seats will be increased by 1 on any registration Expiry On the day
    const increaseAvailableSeatsOnEventExpiry = await EventRegistrationModel.updateAvailableSeatsOnEventExpiry(currentFromDateTime, currenToDateTime);

    //6. Registered Batch and Event Expiry
    const updateOnExpiryOfBatch = await EventRegistrationModel.updateAsTheEventBatchExpires(currentFromDateTime, currenToDateTime);
    const updateOnExpiryOfSubscription = await EventRegistrationModel.updateAsTheEventSubscriptionExpires(currentFromDateTime, currenToDateTime);

    // 7. Coupon Expiry
    const couponExpiry = await CouponModel.updateAsTheCouponExpires(currentFromDateTime, currenToDateTime);

    //8. Event Expiry
    const eventExpiry = await EventModel.updateAsTheEventExpires(currentFromDateTime, currenToDateTime);
    
    //9. Advertisement Expiry
    const AdvertisementExpiry = await JoinModel.addUpdateWhenExpired(currentFromDateTime, currenToDateTime);

    //Reminding the users on the Pending Payments
    const PendingPayments = await InvoiceModel.getEmailIdOfPendingPaymentUsers();
    if(PendingPayments) {
        await Helper.sendEMail(PendingPayments[0].user_email_id, "Your Payment is Still Pending", null,
                "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hello,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b></b>Your Payment is still pending. </p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Please make your Payment soon to enjoy your Sessions.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries you can contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>",
                EmailUtils.getFromAddress());
    }

    // 10. Format a nice email and send to admin
    const reportGenerationDate = CronHelper.getMoment().format("MMMM Do YYYY, h:mm:ss a").toString();

    const emailTemplate = EmailUtil.adminEODReportingTemplate(reportGenerationDate,
        expiringEventTMRO ? expiringEventTMRO.length : 'none',
        expiringRegistrationsTMRO ? expiringRegistrationsTMRO.length : 'none',
        usersSignedupToday ? usersSignedupToday.length : 'none',
        paymentsGotToday ? `Rs. ${paymentsGotToday[0]['total_amount'] || 0}` : 'none'
    );

    if (expiringEventTMRO && expiringEventTMRO.length || usersSignedupToday && usersSignedupToday.length) {
        // To avoid sending un wanted emails

        // "sriharsha.cr@maiora.co, ashritha.shetty@maiora.co, dhanush.kumar@maiora.co, roy.monteiro@maiora.co"
        const mail = await Helper.sendEMail(Helper.getSenderEmailAddress(),
            'The Fit Socials EOD Report', emailTemplate, emailTemplate);
        console.log('Mail = ', mail);

        if (!mail) {
            logger.error("JOB -> EOD Report sending failed, to Admin");
        } else {
            logger.info("JOB -> EOD Report has been sent to Admin");
        }

    } else {
        logger.info("JOB -> EOD Report has not been sent to Admin, due to no new Signup or no Expiring events");
    }

};

