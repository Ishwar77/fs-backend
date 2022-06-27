const express = require("express");
const router = express.Router();
const ApiResponse = require('../models/apiResponse');

const addressRoutes = require('./address-module/address.router');
const eventRoutes = require('./events-module/event.router');
const eventmasterRoutes = require('./event-master-module/eventmaster.router');
const userRoleMasterRoutes = require('./user-role-master/user-role-master.router');
const canlendarRoutes = require('./calendar-module/calendar.router');
const authenticationRoutes = require('./authentication-module/authentication.router');
const mediamasterRoutes = require('./media-type-master-module/mediamaster.router');
const galleryItemRoutes = require('./gallery-items-module/galleryitems.router');
const galleryRoutes = require('./gallery/gallery.router');
const userRoutes = require('./user-module/user.router');
const fitnessCenterRoutes = require('./fitness-center-module/fitnesscenter.router');
const fitnessinfoRoutes = require('./fitness-info-module/fitnessinfo.router');
const paymentRoutes = require('./payment/payment.router');
const subscriptionRoutes = require('./subscription/subscription.router');
const eventRegistrationRoutes = require('./event-registration/eventregistration.router');
const contactUsRoutes = require('./contact-us-module/contactus.router');
const joinRoutes = require('./join/join.routes');
const couponRoutes = require('./coupon-module/coupon.router');
const fileRoutes = require('./files-module/files-module.router');
const reviewRoutes = require('./review-module/review.router');
const frequencyRoutes = require('./batch-frequency-module/frequency.router');
const batchRoutes = require('./batch/batch.router');
const referral = require('./user-referral-module/user-referral.router');
const batchRegistration = require('./event-registration-batches/event-reg-batch.router');
const referralPointsMasterRegistration = require('./points-master-module/points.router');
const userPointsRoute = require("./user-points/user-points.router");
const rpTransactions = require("./rp-transactions/rp-transactions.router");
const genericEmailer = require("./emailHelper");
const attendanceRoutes = require("./attendance-tracking/attendance-tracking.router");
const batchSwitchRoutes = require("./batch-switch-module/batchswitch.router");
const generatedOrdersRoutes = require("./generate-order-module/generate-order.router");
const exportRoutes = require('./export/export.routes');
const sessionRoutes = require("./session/session.router");
const trainerratingroutes = require("./trainer-ratings/trainer-ratings.router");
const advertisementSpotRoutes = require("./advert-spot-master-module/spot.router");
const advertiseRoutes = require("./advertisement-module/advertisement.router");
const redemptionroutes = require("./redemption-master-module/redemption.router");
const pointredemption = require("./points-redemption/points-redemption.router");
const bucketRoutes = require("./s3Bucket-file-upload/s3Bucket.router");
const invoiceRoutes = require("./invoice/invoice.router");

const maioraWebRoutes = require("./maiora-website")
// default route listener
router.get('/', (req, res) => {
    ApiResponse.sendResponse(res, 200, "Listening to API V1 GET");
});


router.use('/auth', authenticationRoutes);
router.use('/email', genericEmailer);

router.use('/address', addressRoutes);
router.use('/events', eventRoutes);
router.use('/eventmaster', eventmasterRoutes);
router.use('/rolemaster', userRoleMasterRoutes);
router.use('/calendar', canlendarRoutes);
router.use('/mediamaster', mediamasterRoutes);
router.use('/galleryitem', galleryItemRoutes);
router.use('/gallery', galleryRoutes);
router.use('/users', userRoutes);
router.use('/fitnesscenter', fitnessCenterRoutes);
router.use('/fitnessinfo', fitnessinfoRoutes);
router.use('/payment', paymentRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/eventregistration', eventRegistrationRoutes);
router.use('/contactus', contactUsRoutes);
router.use('/join', joinRoutes);
router.use('/coupon', couponRoutes);
router.use('/files', fileRoutes);
router.use('/review', reviewRoutes);
router.use('/frequency', frequencyRoutes);
router.use('/batch', batchRoutes);
router.use('/referral', referral);
router.use('/registerbatch', batchRegistration);
router.use('/pointsmaster', referralPointsMasterRegistration);
router.use('/rewards', userPointsRoute);
router.use('/rp-transactions', rpTransactions);
router.use('/attendance', attendanceRoutes);
router.use('/switchingbatch', batchSwitchRoutes);
router.use('/generatedorders', generatedOrdersRoutes);
router.use('/export', exportRoutes);
router.use('/session', sessionRoutes);
router.use('/trainerrating', trainerratingroutes);
router.use('/spot', advertisementSpotRoutes);
router.use('/advertisement', advertiseRoutes);
router.use('/redemption', redemptionroutes);
router.use('/points', pointredemption);
router.use('/uploads', bucketRoutes);
router.use('/maioraweb', maioraWebRoutes);

router.use('/invoice', invoiceRoutes);

module.exports = router;