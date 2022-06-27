const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const BatchModel = require('./batch.model');
const EventModel = require('../events-module/event.model');
const SubscriptionModel = require('../subscription/subscription.model');
const JoinModel = require('../join/join.model');
const BatchUtil = require('./batch.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const UserModel = require("../user-module/user.model");
const Helper = require('../../utils/helper');
const EmailUtils = require('../../utils/emailUtils');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const batchmodel = await BatchModel.getBatch(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Batches", batchmodel);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const batchId = parseInt(req.params.id) || 0;
    const batchmodel = await BatchModel.getBatchById(batchId)
    ApiResponse.sendResponse(res, 200, "Getting Batch on ID", batchmodel);
});

router.get('/subscriptionid/:id', Authorize.verifyJWT, async (req, res) => {
    const SubscriptionUUId = req.params.id || null;
    const subscription = await SubscriptionModel.getSubscriptionByUUId(SubscriptionUUId);
    // console.log("SUBSCRIPTION UUID", SubscriptionUUId);
    // console.log("SUBSCRIPTION ", subscription);
    if(!subscription || !subscription.length || !subscription[0].subscription_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const batchmodel = await BatchModel.getBatchBySubscriptionId(subscription[0].subscription_id)
    ApiResponse.sendResponse(res, 200, "Getting Batch on Subscription ID", batchmodel);
});

router.get('/eventid/:id', Authorize.verifyJWT, async (req, res) => {
    const eventUUId = req.params.id || null;
    const event = await EventModel.getEventByUUId(eventUUId);
    // console.log("EVENT UUID", eventUUId);
    // console.log("EVENT ", event);
    if(!event || !event.length || !event[0].event_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const batchmodel = await BatchModel.getBatchByEventId(event[0].event_id)
    ApiResponse.sendResponse(res, 200, "Getting Batch on Event ID", batchmodel);
});

router.get('/trainer/:id', Authorize.verifyJWT, async (req, res) => {
    const isUUid =  req.query.isUUid === 'true' ?  true :
        typeof req.params.id === 'string' ? true :false;

    let trainerId = -1;
    if(isUUid) {
        // get user by uuid
        const user = await UserModel.getUserByUUId(req.params.id);
        if(!user) {
            ApiResponse.sendResponse(res, 400, "Bad Input");
            return;
        }
        trainerId = user['user_id'];
    } else {
        trainerId = req.params.id || null;
    }

    const days = req.body.days || null;
    const startTime = req.body.startTime || '00:00';
    const endTime = req.body.endTime || '23:59';

    if(!trainerId){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const batchmodel = await BatchModel.getTrainerBatches(trainerId, days, startTime, endTime);

    ApiResponse.sendResponse(res,
        batchmodel && batchmodel.length ? 200 : 400,
        batchmodel && batchmodel.length ? "All Batches of given trainer between time range" : "Unable to get data",
        batchmodel);
});

router.get('/user/:id', Authorize.verifyJWT, async (req, res) => {
    const days = req.body.days || null;
    const startTime = req.body.startTime || '00:00';
    const endTime = req.body.endTime || '23:59';

    const isUUid =  req.query.isUUid === 'true' ?  true :
        typeof req.params.id === 'string' ? true :false;

    let userId = -1;

    if(isUUid) {
        // get user by uuid
        const user = await UserModel.getUserByUUId(req.params.id);
        if(!user) {
            ApiResponse.sendResponse(res, 400, "Bad Input");
            return;
        }
        userId = user['user_id'];
    } else {
        userId = req.params.id || null;
    }

    if(!userId){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const batchmodel = await BatchModel.getUserBatches(userId, days, startTime, endTime);

    ApiResponse.sendResponse(res,
        batchmodel && batchmodel.length ? 200 : 400,
        batchmodel && batchmodel.length ? "All Batches of given trainer between time range" : "Unable to get data",
        batchmodel);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = BatchUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const batchmodel = await BatchModel.createBatch(req.body);
    ApiResponse.sendResponse(res, batchmodel ? 200 : 400, batchmodel ? "Creation Success" : "Creation Failed", batchmodel);
});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const batchId = parseInt(req.params.id) || 0;
    if (!batchId) {
        const msg = "Batch: PUT Id = " + batchId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Batch Id seems invalid", msg);
        return;
    }
    const err = BatchUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const batchmodel = await BatchModel.updateBatchById(batchId, req.body);
    ApiResponse.sendResponse(res, batchmodel ? 200 : 400, batchmodel ?"Update Success" : "Update Failed", {status: batchmodel });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const batchId = parseInt(req.params.id) || 0;
    if (!batchId) {
        const msg = "Batch: DELETE Id = " + batchId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Batch Id seems invalid", msg);
        return;
    } 
   const batchmodel = await BatchModel.deleteBatchById(batchId);
    // console.log(batchmodel);
    ApiResponse.sendResponse(res, batchmodel === 1 ? 200 : 400, batchmodel  === 1 ?"Delete Success" : "Deletion Failed", {status: batchmodel });
});


//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const batches = await BatchModel.getBatchByUUID(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Batches", batches);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = BatchUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const batches = await BatchModel.updateBatchByUUID(req.params.id, req.body);
    ApiResponse.sendResponse(res, batches ? 200 : 400, batches ? "Update Success" : "Update Failed", { status: batches });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const batches = await BatchModel.deleteBatchByUUID(req.params.id);
    ApiResponse.sendResponse(res, batches === 1 ? 200 : 400, batches === 1 ? "Delete Success" : "Deletion Failed", { status: batches });
});


router.put('/start/:id', Authorize.verifyJWT, async (req, res) => {
    const err = BatchUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Updation failed due to bad Inputs", err);
        return;
    }
    const batches = await BatchModel.startingBatchByUUID(req.params.id, req.body);
    ApiResponse.sendResponse(res, batches ? 200 : 400, batches ? "Update Success" : "Update Failed", { status: batches });
    const email = await JoinModel.batchregistemailid(req.body.batches_id);
    // console.log("EVENT NAME ", email[0].event_name);
    const emailids = email.map(b => b['email_id']);
    // console.log('ID = ', emailids.length);
    if(emailids.length == 0){
        // ApiResponse.sendResponse(res, 400, "No Users Registered for this event", err);
        console.log("No Users Registered for this event")
        return null
    } else {
    // console.log('ID = ', emailids);
    await Helper.sendEMail(emailids, "Your Event is About to Start", null,
                "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hello,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b></b>Trainer has Started the event <b>"+email[0].event_name+"</b>. </p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Your event will be starting Sooner.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Please Join the Session.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries you can contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>",
                EmailUtils.getFromAddress());
    // ApiResponse.sendResponse(res, batches ? 200 : 400, batches ? "Update Success" : "Update Failed", { status: batches });
    }
});
module.exports = router;