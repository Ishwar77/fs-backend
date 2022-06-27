const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const EventRegisterModel = require('../event-registration/eventregistration.model');
const BatchModel = require('../batch/batch.model');
const EventRegisterUtil = require('../event-registration/eventregistration.util');
const MyConst = require('../utils');
const JoinModel = require('./join.model');
const Authorize = require('../middlewares/authorize');
const UserModel = require('../user-module/user.model');
const EventModel = require('../events-module/event.model');
const BatchesDAO = require("../batch/batch.dao");
const AddSpotModel = require('../advert-spot-master-module/spot.model');

router.get('/userID/:user_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.user_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getAllDetails(user.user_id);
    // logger.info('Rows = ', rows);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/paymentdetails', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await JoinModel.getAllPaymentDetails();
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/instructorid/:instructor_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.instructor_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getTrainerRegisteredUserWhoareActive(user.user_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/notactive/instructorid/:instructor_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.instructor_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getInactiveUserTrainerRegisteredUser(user.user_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/event/:event_id/instructor/:instructor_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const eid = req.params.event_id
    const event = await EventModel.getEventByUUId(eid);
    if(!event || !event[0].event_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const iid = req.params.instructor_id;
    const user = await UserModel.getUserByUUId(iid);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getUsersForTrainerAndParticularEvent(event[0].event_id, user.user_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/listofusersforanevent/:event_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const eid = req.params.event_id
    const event = await EventModel.getEventByUUId(eid);
    if(!event || !event[0].event_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.usersListforanEvent(event[0].event_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/allreview', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await JoinModel.getAllReviews();
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/testimonies/:event_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.event_id;
    const event = await EventModel.getEventByUUId(id);
    if(!event || !event[0].event_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getTestimoniesOnEventId(event[0].event_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/alluserdetails/:event_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.event_id;
    const event = await EventModel.getEventByUUId(id);
    if(!event || !event[0].event_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.AllUsersDetailonEventID(event[0].event_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/activecount', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await JoinModel.activeCounts();
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/numberofsubscription/:user_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.user_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getNumberOfSubscribedEvent(user.user_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/traineractiveevent/:instructor_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.instructor_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getTrainerActiveEvents(user.user_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/status/:instructor_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.instructor_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getPayment(user.user_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/topevents', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await JoinModel.getTopEvents();
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/highestuser', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await JoinModel.getHighestUsers();
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/peaktrainer', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await JoinModel.getPeakTrainers();
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/countpayment/:instructor_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.instructor_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getCountOfPayment(user.user_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/reviewcount/:instructor_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.instructor_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getReviewCount(user.user_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/batchandsubscription/:event_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.event_id;
    const event = await EventModel.getEventByUUId(id);
    if(!event || !event[0].event_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getBatchAndSubscription(event[0].event_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/uniquebatch/:instructor_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.instructor_id;
    const user = await UserModel.getUserByUUId(id);
    // console.log("USER ", id);
    // console.log("USER ", user);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getUniqueBatchesOnInstructor(user.user_id);
    // console.log("ROWS ", rows);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/nextuserbatch/:user_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.user_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getNextBatchTimeandDetails(user.user_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/onuserid/:user_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.user_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.getUserTransactionListById(user.user_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/email/:batch_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.batch_id;
    const batch = await BatchModel.getBatchByUUID(id);
    // console.log(batch[0].batches_id);
    // console.log(id)
    if(!batch || !batch[0].batches_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.batchregistemailid(batch[0].batches_id);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/attendeesbatchid/:batch_id/atendeeslistobdate/:date', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.batch_id;
    const dateValue = req.params.date;
    const batch = await BatchModel.getBatchByUUID(id);
    // console.log(batch[0].batches_id)
    // console.log(dateValue);
    if(!batch || !batch[0].batches_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.listOfAtendees(batch[0].batches_id, dateValue);
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    // console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

const CronHelper = require("../../cron-jobs/v1/cron-helper");
router.get('/basedonspotid/:id', Authorize.verifyJWT, async (req, res) => {
  const spotUUId = req.params.id || null;
  const spot = await AddSpotModel.getAdvertisementSpotByUUID(spotUUId);
  const currentDate = CronHelper.getMoment().format("YYYY-MM-DD").toString();
  const futureFromDateTime = currentDate + ' 12:00:00';
  // console.log(futureFromDateTime);
  // console.log("USER UUID", spotUUId);
  // console.log("USER ", spot[0].spot_number);
  if(!spot || !spot[0].spot_number){
      ApiResponse.sendResponse(res, 400, "Bad Input");
      return;
  }
  const spots = await JoinModel.advertise(spot[0].spot_number, futureFromDateTime);
  // console.log(spots);
  ApiResponse.sendResponse(res, 200, "Getting all Advertisements", spots);
});
module.exports = router;