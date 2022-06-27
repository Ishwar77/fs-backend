const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const EventModel = require('./event.model');
const MyConst = require('../utils');
const EventUtility = require('./event.util');
const Authorize = require('../middlewares/authorize');
const UserModel = require('../user-module/user.model');


router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const events = await EventModel.getEvent(from, limit)
    const filtered = await EventUtility.filterEvents(events, req.headers);
    ApiResponse.sendResponse(res, 200, "Getting all Events", filtered);
});

router.get('/inactive', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const events = await EventModel.getInactiveEvent(from, limit)
    const filtered = await EventUtility.filterEvents(events, req.headers);
    ApiResponse.sendResponse(res, 200, "Getting all Events", filtered);
});


router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventId = parseInt(req.params.id) || 0;
    const events = await EventModel.getEventById(eventId)
    const filtered = await EventUtility.filterEvents([events], req.headers);

    if(filtered && filtered.length) {
        ApiResponse.sendResponse(res, 200, "Getting Event",filtered[0]);
        return;
    } else {
        ApiResponse.sendResponse(res, 400, "No Event, for id " + eventId);
    }

});

router.get('/oninstructorid/:id', Authorize.verifyJWT, async (req, res) => {
    const userUUId = req.params.id || null;
    const user = await UserModel.getUserByUUId(userUUId);
    // console.log("USER UUID", userUUId);
    // console.log("USER ", user.user_id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const events = await EventModel.getEventByInstructorId(user.user_id)
    ApiResponse.sendResponse(res, 200, "Getting all Event Masters", events);
});

router.get('/blocked/:id', Authorize.verifyJWT, async (req, res) => {
    const userUUId = req.params.id || null;
    const user = await UserModel.getUserByUUId(userUUId);
    // console.log("USER UUID", userUUId);
    // console.log("USER ", user.user_id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const events = await EventModel.getBlockedEventByInstructorId(user.user_id)
    ApiResponse.sendResponse(res, 200, "Getting all Event Masters", events);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {

    const err = EventUtility.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const events = await EventModel.createEvent(req.body);
    // console.log(events);
    ApiResponse.sendResponse(res, events ? 200 : 400, events ? "Creation Success" : "Creation Failed", events);
});


router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventId = parseInt(req.params.id) || 0;

    if (!eventId) {
        const msg = "Event: PUT Id = " + eventId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Event Id seems invalid", msg);
        return;
    }

    const err = EventUtility.hasError(req.body, MyConst.ValidationModelFor.UPDATE)

    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

   const events = await EventModel.updateEventById(eventId, req.body);

   ApiResponse.sendResponse(res, events ? 200 : 400, events ? "Update Success" : "Update Failed", { status: events });
});


router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventId = parseInt(req.params.id) || 0;

    if (!eventId) {
        const msg = "Event: Delete Id = " + eventId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Event Id seems invalid", msg);
        return;
    }
   const events = await EventModel.deleteEventById(eventId);
  //  console.log(events);
    ApiResponse.sendResponse(res, events === 1 ? 200 : 400, events  === 1 ?"Delete Success" : "Deletion Failed", {status: events });
});


//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const eventss = await EventModel.getEventByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting events", eventss);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = EventUtility.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const eventss = await EventModel.updateEventByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, eventss ? 200 : 400, eventss ? "Update Success" : "Update Failed", { status: eventss });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const eventss = await EventModel.deleteEventByUUId(req.params.id);
    ApiResponse.sendResponse(res, eventss === 1 ? 200 : 400, eventss === 1 ? "Delete Success" : "Deletion Failed", { status: eventss });
});

module.exports = router;