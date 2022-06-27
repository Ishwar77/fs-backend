const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const CalendarModel = require('./calendar.model');
const CalendarUtil = require('./calendar.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const calendars = await CalendarModel.getCalendar(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Calendar", calendars);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const calendarId = parseInt(req.params.id) || 0;
    const calendars = await CalendarModel.getCalendarById(calendarId)
    ApiResponse.sendResponse(res, 200, "Getting all Calendar", calendars);
});

router.post('/', [Authorize.verifyJWT, Authorize.adminOnly], async (req, res) => {
    // Validate the Model
    const err = CalendarUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const calendars = await CalendarModel.createCalendar(req.body);
    ApiResponse.sendResponse(res, calendars ? 200 : 400, calendars ? "Creation Success" : "Creation Failed", calendars);
});

router.put('/:id', [Authorize.verifyJWT, Authorize.adminOnly], async (req, res) => {
    const calendarId = parseInt(req.params.id) || 0;
    if (!calendarId) {
        const msg = "Calendar: PUT Id = " + calendarId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Calendar Id seems invalid", msg);
        return;
    }
    const err = CalendarUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const calendars = await CalendarModel.updateCalendarById(calendarId, req.body);
    ApiResponse.sendResponse(res, calendars ? 200 : 400, calendars ? "Update Success" : "Update Failed", { status: calendars });
});

router.delete('/:id', [Authorize.verifyJWT, Authorize.adminOnly], async (req, res) => {
    const calendarId = parseInt(req.params.id) || 0;
    if (!calendarId) {
        const msg = "Calendar: PUT Id = " + calendarId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Calendar Id seems invalid", msg);
        return;
    } 
   const calendars = await CalendarModel.deleteCalendarById(calendarId);
   // console.log(calendars);
    ApiResponse.sendResponse(res, calendars === 1 ? 200 : 400, calendars  === 1 ?"Delete Success" : "Deletion Failed", {status: calendars });
});

module.exports = router;