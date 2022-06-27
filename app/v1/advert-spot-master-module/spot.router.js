const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const AdverSpotModel = require('./spot.model');
const AdverSpotUtil = require('./spot.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const Helper = require('../../utils/helper');
const EmailUtils = require('../../utils/emailUtils');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const adevrtiseSpotModel = await AdverSpotModel.getAdvertisementSpot(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Advertisement Spots", adevrtiseSpotModel);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const spotNumber = parseInt(req.params.id) || 0;
    const adevrtiseSpotModel = await AdverSpotModel.getAdvertisementSpotById(spotNumber)
    ApiResponse.sendResponse(res, 200, "Getting Advertisement Spots on ID", adevrtiseSpotModel);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = AdverSpotUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const adevrtiseSpotModel = await AdverSpotModel.createAdvertisementSpot(req.body);
    ApiResponse.sendResponse(res, adevrtiseSpotModel ? 200 : 400, adevrtiseSpotModel ? "Creation Success" : "Creation Failed", adevrtiseSpotModel);
});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const spotNumber = parseInt(req.params.id) || 0;
    if (!spotNumber) {
        const msg = "Advertisement Spots: PUT Id = " + spotNumber + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Advertisement Spots Id seems invalid", msg);
        return;
    }
    const err = AdverSpotUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const adevrtiseSpotModel = await AdverSpotModel.updateSpotNumberById(spotNumber, req.body);
    ApiResponse.sendResponse(res, adevrtiseSpotModel ? 200 : 400, adevrtiseSpotModel ?"Update Success" : "Update Failed", {status: adevrtiseSpotModel });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const spotNumber = parseInt(req.params.id) || 0;
    if (!spotNumber) {
        const msg = "Advertisement Spots: DELETE Id = " + spotNumber + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Advertisement Spots Id seems invalid", msg);
        return;
    } 
   const adevrtiseSpotModel = await AdverSpotModel.deleteAdverSpotById(spotNumber);
    ApiResponse.sendResponse(res, adevrtiseSpotModel === 1 ? 200 : 400, adevrtiseSpotModel  === 1 ?"Delete Success" : "Deletion Failed", {status: adevrtiseSpotModel });
});

//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const adevrtiseSpotModel = await AdverSpotModel.getAdvertisementSpotByUUID(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Adevrtisement Spot", adevrtiseSpotModel);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = AdverSpotUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const adevrtiseSpotModel = await AdverSpotModel.updateAdvertisementSpotByUUID(req.params.id, req.body);
    ApiResponse.sendResponse(res, adevrtiseSpotModel ? 200 : 400, adevrtiseSpotModel ? "Update Success" : "Update Failed", { status: adevrtiseSpotModel });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const adevrtiseSpotModel = await AdverSpotModel.deleteAdvertisementSpotByUUID(req.params.id);
    ApiResponse.sendResponse(res, adevrtiseSpotModel === 1 ? 200 : 400, adevrtiseSpotModel === 1 ? "Delete Success" : "Deletion Failed", { status: adevrtiseSpotModel });
});

module.exports = router;