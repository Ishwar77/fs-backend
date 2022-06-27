const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const ReviewModel = require('./review.model');
const ReviewUtil = require('./review.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const UserModel = require('../user-module/user.model');
const EventModel = require('../events-module/event.model');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const reviews = await ReviewModel.getReview(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Review", reviews);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const ReviewId = parseInt(req.params.id) || 0;
    const reviews = await ReviewModel.getReviewById(ReviewId)
    ApiResponse.sendResponse(res, 200, "Getting all Review", reviews);
});

router.get('/userid/:id', Authorize.verifyJWT, async (req, res) => {
    const userUUId = req.params.id || null;
    const user = await UserModel.getUserByUUId(userUUId);
    // console.log("USER UUID", userUUId);
    // console.log("USER ", user.user_id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const reviews = await ReviewModel.getReviewByUserId(user.user_id)
    ApiResponse.sendResponse(res, 200, "Getting all Review", reviews);
});

router.get('/eventid/:id', Authorize.verifyJWT, async (req, res) => {
    const eventUUId = req.params.id || null;
    const event = await EventModel.getEventByUUId(eventUUId);
    // console.log("EVENT UUID", eventUUId);
    // console.log("EVENT ", event);
    if(!event || !event.length || !event[0].event_id){
        APIResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const reviews = await ReviewModel.getReviewByEventId(event[0].event_id)
    ApiResponse.sendResponse(res, 200, "Getting all Review", reviews);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = ReviewUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const reviews = await ReviewModel.createReview(req.body);
    ApiResponse.sendResponse(res, reviews ? 200 : 400, reviews ? "Creation Success" : "Creation Failed", reviews);
});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const ReviewId = parseInt(req.params.id) || 0;
    if (!ReviewId) {
        const msg = "Review: PUT Id = " + ReviewId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Review Id seems invalid", msg);
        return;
    }
    const err = ReviewUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   //console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const reviews = await ReviewModel.updateReviewById(ReviewId, req.body);
    ApiResponse.sendResponse(res, reviews ? 200 : 400, reviews ?"Update Success" : "Update Failed", {status: reviews });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const ReviewId = parseInt(req.params.id) || 0;
    if (!ReviewId) {
        const msg = "Review: PUT Id = " + ReviewId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Review Id seems invalid", msg);
        return;
    } 
   const reviews = await ReviewModel.deleteReviewById(ReviewId);
    ApiResponse.sendResponse(res, reviews === 1 ? 200 : 400, reviews  === 1 ?"Delete Success" : "Deletion Failed", {status: reviews });
});


//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const reviews = await ReviewModel.getReviewByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting reviews", reviews);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = ReviewUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const reviews = await ReviewModel.updateReviewByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, reviews ? 200 : 400, reviews ? "Update Success" : "Update Failed", { status: reviews });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const reviews = await ReviewModel.deleteReviewByUUId(req.params.id);
    ApiResponse.sendResponse(res, reviews === 1 ? 200 : 400, reviews === 1 ? "Delete Success" : "Deletion Failed", { status: reviews });
});
module.exports = router;