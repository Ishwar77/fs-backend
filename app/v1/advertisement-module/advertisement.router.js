const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const AdvertisementModel = require('./advertisement.model');
const AdvertisementUtil = require('./advertisement.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const Helper = require('../../utils/helper');
const EmailUtils = require('../../utils/emailUtils');
const AddSpotModel = require('../advert-spot-master-module/spot.model');
const CronHelper = require("../../cron-jobs/v1/cron-helper");

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const adevrtisementModel = await AdvertisementModel.getAdvertisement(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Advertisements", adevrtisementModel);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const advertisementID = parseInt(req.params.id) || 0;
    const adevrtisementModel = await AdvertisementModel.getAdvertisementById(advertisementID)
    ApiResponse.sendResponse(res, 200, "Getting Advertisements on ID", adevrtisementModel);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = AdvertisementUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const adevrtisementModel = await AdvertisementModel.createAdvertisement(req.body);
    ApiResponse.sendResponse(res, adevrtisementModel ? 200 : 400, adevrtisementModel ? "Creation Success" : "Creation Failed", adevrtisementModel);
});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const advertisementID = parseInt(req.params.id) || 0;
    if (!advertisementID) {
        const msg = "Batch: PUT Id = " + advertisementID + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Batch Id seems invalid", msg);
        return;
    }
    const err = AdvertisementUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const adevrtisementModel = await AdvertisementModel.updateAdvertisementById(advertisementID, req.body);
    ApiResponse.sendResponse(res, adevrtisementModel ? 200 : 400, adevrtisementModel ?"Update Success" : "Update Failed", {status: adevrtisementModel });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const advertisementID = parseInt(req.params.id) || 0;
    if (!advertisementID) {
        const msg = "Batch: DELETE Id = " + advertisementID + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Batch Id seems invalid", msg);
        return;
    } 
   const adevrtisementModel = await AdvertisementModel.deleteAdvertisementById(advertisementID);
    ApiResponse.sendResponse(res, adevrtisementModel === 1 ? 200 : 400, adevrtisementModel  === 1 ?"Delete Success" : "Deletion Failed", {status: adevrtisementModel });
});

//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const adevrtisementModel = await AdvertisementModel.getAdvertisementByUUID(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Adevrtisement Spot", adevrtisementModel);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = AdvertisementUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const adevrtisementModel = await AdvertisementModel.updateAdvertisementByUUID(req.params.id, req.body);
    ApiResponse.sendResponse(res, adevrtisementModel ? 200 : 400, adevrtisementModel ? "Update Success" : "Update Failed", { status: adevrtisementModel });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const adevrtisementModel = await AdvertisementModel.deleteAdvertisementByUUID(req.params.id);
    ApiResponse.sendResponse(res, adevrtisementModel === 1 ? 200 : 400, adevrtisementModel === 1 ? "Delete Success" : "Deletion Failed", { status: adevrtisementModel });
});


router.post('/adding', Authorize.verifyJWT, async (req, res) => {
    if(!req.body) {
        logger.error("Failed");
        logger.error(JSON.stringify(req.body));
        ApiResponse.sendResponse(res, 400, "Advertisement Creation Failed due to bad Inputs");
        return;
    }
    const Advertisements = await AdvertisementModel.createAdvertisementWithPayment(req.body);
    ApiResponse.sendResponse(res, Advertisements ? 200 : 400, Advertisements ? "Creation Success" : "Creation Failed", Advertisements);
});


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
    const spots = await AdvertisementModel.getAdvertisementOnSpotAndDate(spot[0].spot_number, futureFromDateTime);
    // console.log(spots);
    ApiResponse.sendResponse(res, 200, "Getting all Advertisements", spots);
});

module.exports = router;