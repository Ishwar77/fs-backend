const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const EventMasterModel = require('./eventmaster.model');
const EventMasterUtil = require('./eventmaster.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const eventmodels = await EventMasterModel.getEventMaster(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Event Model", eventmodels);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    const eventmasters = await EventMasterModel.getEventMasterById(eventmasterId)
    ApiResponse.sendResponse(res, 200, "Getting all Event Masters", eventmasters);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    
    const err = EventMasterUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const eventmasters = await EventMasterModel.createEventMaster(req.body);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ? "Creation Success" : "Creation Failed", eventmasters);

});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    if (!eventmasterId) {
        const msg = "Event Master: PUT Id = " + eventmasterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Event Master Id seems invalid", msg);
        return;
    }

    const err = EventMasterUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   //console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

   const eventmasters = await EventMasterModel.updateEventMasterById(eventmasterId, req.body);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ?"Update Success" : "Update Failed", {status: eventmasters });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    if (!eventmasterId) {
        const msg = "Event Master: PUT Id = " + eventmasterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Event Master Id seems invalid", msg);
        return;
    } 
   const eventmasters = await EventMasterModel.deleteEventMasterById(eventmasterId);
   // console.log(eventmasters);
    ApiResponse.sendResponse(res, eventmasters === 1 ? 200 : 400, eventmasters  === 1 ?"Delete Success" : "Deletion Failed", {status: eventmasters });
});



//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasters = await EventMasterModel.getEventMasterByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting eventmasters", eventmasters);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = EventMasterUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const eventmasters = await EventMasterModel.updateEventMasterByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ? "Update Success" : "Update Failed", { status: eventmasters });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasters = await EventMasterModel.deleteEventMasterByUUId(req.params.id);
    ApiResponse.sendResponse(res, eventmasters === 1 ? 200 : 400, eventmasters === 1 ? "Delete Success" : "Deletion Failed", { status: eventmasters });
});
module.exports = router;