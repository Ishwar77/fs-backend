const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const CouponModel = require('./coupon.model');
const CouponUtil = require('./coupon.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const EventModel = require('../events-module/event.model');

/** To get all unexpeired coupons */
router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const showAll = req.query.showAll || false
    const galleries = await CouponModel.getCoupons(from, limit, showAll)
    ApiResponse.sendResponse(res, 200, "Getting all Coupons", galleries);
});

router.get('/private', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const showAll = req.query.showAll || false
    const galleries = await CouponModel.getPrivateCoupons(from, limit, showAll)
    ApiResponse.sendResponse(res, 200, "All Private Coupons", galleries);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const galleryId = parseInt(req.params.id) || 0;
    const galleries = await CouponModel.getCouponById(galleryId)
    ApiResponse.sendResponse(res, 200, "Matching Coupon", galleries);
});

router.get('/code/:code/:eventId', /* Authorize.verifyJWT, */ async (req, res) => {
    const couponCode = req.params.code || null;
    const eventId = parseInt(req.params.eventId || -1);

    if(!couponCode || !couponCode.length || !eventId) {
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }

    const galleries = await CouponModel.getCouponByCodeAndEvent(couponCode, eventId)
    ApiResponse.sendResponse(res, galleries ? 200 : 400, galleries ? "Matching Coupon" : "No Coupons", galleries);
});

router.get('/event/:id', Authorize.verifyJWT, async (req, res) => {
    const eventUUId = req.params.id || null;
    const privateCoupons = req.query.privateCoupons === 'true' ?  true :
    req.query.privateCoupons === 'all' ? 'all' : false;

    const event = await EventModel.getEventByUUId(eventUUId);
    // console.log("EVENT UUID", eventUUId);
    // console.log("EVENT ", event);
    if(!event || !event.length || !event[0].event_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const galleries = await CouponModel.getCouponsByEventId(event[0].event_id, privateCoupons)
    ApiResponse.sendResponse(res, 200, "Matching Event's Coupon", galleries);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = CouponUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const galleries = await CouponModel.createCoupon(req.body);
    ApiResponse.sendResponse(res, galleries ? 200 : 400, galleries ? "Creation Success" : "Creation Failed", galleries);
});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const galleryId = parseInt(req.params.id) || 0;
    if (!galleryId) {
        const msg = "Coupon: PUT Id = " + galleryId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Coupon Id seems invalid", msg);
        return;
    }

    const err = CouponUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   //console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const galleries = await CouponModel.updatCouponById(galleryId, req.body);
    ApiResponse.sendResponse(res, galleries ? 200 : 400, galleries ?"Update Success" : "Update Failed", {status: galleries });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const couponid = parseInt(req.params.id) || 0;
    if (!couponid) {
        const msg = "Coupon: PUT Id = " + couponid + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Coupon Id seems invalid", msg);
        return;
    } 
   const coupons = await CouponModel.deleteCouponById(couponid);
   // console.log(coupons);
    ApiResponse.sendResponse(res, coupons === 1 ? 200 : 400, coupons  === 1 ? "Delete Success" : "Deletion Failed", {status: coupons });
});


//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const coupons = await CouponModel.getCouponByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting coupons", coupons);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = CouponUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const coupons = await CouponModel.updatCouponByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, coupons ? 200 : 400, coupons ? "Update Success" : "Update Failed", { status: coupons });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const coupons = await CouponModel.deleteCouponByUUId(req.params.id);
    ApiResponse.sendResponse(res, coupons === 1 ? 200 : 400, coupons === 1 ? "Delete Success" : "Deletion Failed", { status: coupons });
});
module.exports = router;