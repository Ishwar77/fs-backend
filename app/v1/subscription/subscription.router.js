const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const SubscriptionModel = require('./subscription.model');
const SubscriptionUtil = require('./subscription.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const EventModel = require('../events-module/event.model');
const UserModel = require("../user-module/user.model");

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const subscriptions = await SubscriptionModel.getSubscription(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Subscription", subscriptions);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const SubscriptionId = parseInt(req.params.id) || 0;
    const Subscriptions = await SubscriptionModel.getSubscriptionById(SubscriptionId)
    ApiResponse.sendResponse(res, 200, "Getting all Subscription", Subscriptions);
});

router.get('/eventid/:id', /* Authorize.verifyJWT, */ async (req, res) => {
    const eventUUId = req.params.id || null;
    const event = await EventModel.getEventByUUId(eventUUId);
    // console.log("EVENT UUID", eventUUId);
    // console.log("EVENT ", event);
    if (!event || !event.length || !event[0].event_id) {
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const Subscriptions = await SubscriptionModel.getSubscriptionByEventId(event[0].event_id)
    ApiResponse.sendResponse(res, 200, "Getting all Subscription", Subscriptions);
});

router.get('/trainer/:id', /* Authorize.verifyJWT, */ async (req, res) => {

    const isUUid = req.query.isUUid === 'true' ? true :
        typeof req.params.id === 'string' ? true : false;


    const price = req.body.price || 0;
    let trainerId = -1;
   // console.log(isUUid);
    if (isUUid) {
        // get user by uuid
        const user = await UserModel.getUserByUUId(req.params.id);
        if (!user) {
            ApiResponse.sendResponse(res, 400, "Bad Input");
            return;
        }
        trainerId = user['user_id'];
    } else {
        trainerId = req.params.id || null;
    }
    // console.log('trainerId = ', trainerId);
    const Subscriptions = await SubscriptionModel.getTrainersSubscriptionsByPrice(trainerId, price)
    ApiResponse.sendResponse(res, Subscriptions ? 200 : 400,
        Subscriptions ? "Trainer's event Subscriptions" : "No Data found", Subscriptions);
});

router.post('/',/*  Authorize.verifyJWT, */ async (req, res) => {
    const err = SubscriptionUtil.hasError(req.body)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const Subscriptions = await SubscriptionModel.createSubscription(req.body);
    ApiResponse.sendResponse(res, Subscriptions ? 200 : 400, Subscriptions ? "Creation Success" : "Creation Failed", Subscriptions);
});


router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const SubscriptionId = parseInt(req.params.id) || 0;
    if (!SubscriptionId) {
        const msg = "Subscription: PUT Id = " + SubscriptionId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Subscription Id seems invalid", msg);
        return;
    }

    const err = SubscriptionUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   // console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const Subscriptions = await SubscriptionModel.updateSubscriptionById(SubscriptionId, req.body);
    ApiResponse.sendResponse(res, Subscriptions ? 200 : 400, Subscriptions ? "Update Success" : "Update Failed", { status: Subscriptions });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const SubscriptionId = parseInt(req.params.id) || 0;
    if (!SubscriptionId) {
        const msg = "Subscription: PUT Id = " + SubscriptionId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Subscription Id seems invalid", msg);
        return;
    }
    const Subscriptions = await SubscriptionModel.deleteSubscriptionById(SubscriptionId);
   // console.log(Subscriptions);
    ApiResponse.sendResponse(res, Subscriptions === 1 ? 200 : 400, Subscriptions === 1 ? "Delete Success" : "Deletion Failed", { status: Subscriptions });
});


//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const Subscriptions = await SubscriptionModel.getSubscriptionByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Subscriptions", Subscriptions);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = SubscriptionUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const Subscriptions = await SubscriptionModel.updateSubscriptionByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, Subscriptions ? 200 : 400, Subscriptions ? "Update Success" : "Update Failed", { status: Subscriptions });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const Subscriptions = await SubscriptionModel.deleteSubscriptionByUUId(req.params.id);
    ApiResponse.sendResponse(res, Subscriptions === 1 ? 200 : 400, Subscriptions === 1 ? "Delete Success" : "Deletion Failed", { status: Subscriptions });
});
module.exports = router;