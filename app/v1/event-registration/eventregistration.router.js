const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const EventRegisterModel = require('./eventregistration.model');
const EventRegisterUtil = require('./eventregistration.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const UserModel = require('../user-module/user.model');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const registrations = await EventRegisterModel.getEventRegistration(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Event Registration", registrations);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const EventRegisterId = parseInt(req.params.id) || 0;
    const EventRegisters = await EventRegisterModel.getEventRegistrationById(EventRegisterId)
    ApiResponse.sendResponse(res, 200, "Getting all Event Registrations", EventRegisters);
});

router.get('/checkifalreadysubscribed/:user_id/event/:event_id', Authorize.verifyJWT, async (req, res) => {
    const UserId = parseInt(req.params.user_id) || 0;
    const EventId = parseInt(req.params.event_id) || 0;
    const CheckAlrearyRegistered = await EventRegisterModel.checkIfAlreadySubscribedToAnEvent(UserId, EventId)
    console.log(CheckAlrearyRegistered.length);
    ApiResponse.sendResponse(res, 200, "Getting all Registrations", CheckAlrearyRegistered);
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
    const EventRegisters = await EventRegisterModel.getEventRegistrationByUserId(user.user_id)
    ApiResponse.sendResponse(res, 200, "Getting all Event Registrations of the User", EventRegisters);
});

router.post('/', [Authorize.verifyJWT, Authorize.clientOnly], async (req, res) => {

    const err = EventRegisterUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const EventRegisters = await EventRegisterModel.createEventRegistration(req.body);

    ApiResponse.sendResponse(res, EventRegisters ? 200 : 400, EventRegisters ? "Creation Success" : "Creation Failed", EventRegisters);

});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const EventRegisterId = parseInt(req.params.id) || 0;
    if (!EventRegisterId) {
        const msg = "Event Registration: PUT Id = " + EventRegisterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Event Registration Id seems invalid", msg);
        return;
    }

    const err = EventRegisterUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   // console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const EventRegisters = await EventRegisterModel.updateEventRegistrationById(EventRegisterId, req.body);
    ApiResponse.sendResponse(res, EventRegisters ? 200 : 400, EventRegisters ? "Update Success" : "Update Failed", { status: EventRegisters });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const EventRegisterId = parseInt(req.params.id) || 0;
    if (!EventRegisterId) {
        const msg = "Event Registration: PUT Id = " + EventRegisterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Event Registration Id seems invalid", msg);
        return;
    }
    const EventRegisters = await EventRegisterModel.deleteEventRegistrationById(EventRegisterId);
   // console.log(EventRegisters);
    ApiResponse.sendResponse(res, EventRegisters === 1 ? 200 : 400, EventRegisters === 1 ? "Delete Success" : "Deletion Failed", { status: EventRegisters });
});


router.post('/Registration', Authorize.verifyJWT, async (req, res) => {
    if(!req.body /* || !req.body.event || !req.body.payment || !req.body.batch */) {
        logger.error("Failed");
        logger.error(JSON.stringify(req.body));
        ApiResponse.sendResponse(res, 400, "Registration Failed due to bad Inputs");
        return;
    }

    const EventRegisters = await EventRegisterModel.createEventRegistration(req.body);
    // console.log("EVENTS = ", EventRegisters);
    ApiResponse.sendResponse(res, EventRegisters ? 200 : 400, EventRegisters ? "Creation Success" : "Creation Failed", EventRegisters);

});

module.exports = router;