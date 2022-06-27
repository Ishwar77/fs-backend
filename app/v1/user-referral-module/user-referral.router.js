const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const UserReferralModel = require('./user-referral.model');
const UserReferralUtil = require('./user-referral.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const eventmodels = await UserReferralModel.getAllReferrals(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Referrals", eventmodels);
});

/** To get all referrals made by a user */
router.get('/by/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    const eventmasters = await UserReferralModel.getUserReferralByUserIds(eventmasterId, true)
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, "Referring User's Referral info", eventmasters);
});

/** To get referral invite recieved by a user */
router.get('/to/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    const eventmasters = await UserReferralModel.getUserReferralByUserIds(eventmasterId, false)
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, "Invited User's Referral info", eventmasters);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    const eventmasters = await UserReferralModel.getUserReferralById(eventmasterId)
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, "Referral Info", eventmasters);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {

    const err = UserReferralUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const referral = await UserReferralModel.create(req.body);
    ApiResponse.sendResponse(res, referral ? 200 : 400, referral ? "Creation Success" : "Creation Failed", referral);

 });

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    if (!eventmasterId) {
        const msg = "User: PUT Id = " + eventmasterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "User Id seems invalid", msg);
        return;
    }

    const err = UserReferralUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
 //  console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

   const eventmasters = await UserReferralModel.updateReferral(eventmasterId, req.body, 1);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ?"Update Success" : "Update Failed", {status: eventmasters });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    if (!eventmasterId) {
        const msg = "ReferralModel: Delete Id = " + eventmasterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "ReferralModel Id seems invalid", msg);
        return;
    } 
   const eventmasters = await UserReferralModel.deleteByReferralId(eventmasterId);
   // console.log(eventmasters);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ?"Delete Success" : "Deletion Failed", {status: eventmasters });
});

module.exports = router;