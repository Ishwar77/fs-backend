const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const AttendancetrackerModel = require('./attendance-tracking.model');
const AttendancetrackerUtil = require('./attendance-tracking.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const batchregistrationmodel = await AttendancetrackerModel.getAttendance(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Attendance", batchregistrationmodel);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const regbatchId = parseInt(req.params.id) || 0;
    const batchregistrationmodel = await AttendancetrackerModel.getUsersbasedonAttendanceId(regbatchId)
    ApiResponse.sendResponse(res, 200, "Getting all Attendance based on batch ID", batchregistrationmodel);
});

router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const regbatchId = parseInt(req.params.id) || 0;
    const batchregistrationmodel = await AttendancetrackerModel.getUsersbasedonAttendanceuuId(regbatchId)
    ApiResponse.sendResponse(res, 200, "Getting all Attendance based on UUID", batchregistrationmodel);
});

router.get('/:id/:date', Authorize.verifyJWT, async (req, res) => {
    const batchId = parseInt(req.params.id) || 0;
    const date = parseInt(req.params.date) || 0;
   // console.log(batchId,date);
    const batchregistrationmodel = await AttendancetrackerModel.getdetailsbydate(batchId,date)
    ApiResponse.sendResponse(res, 200, "Getting all Attendance based on UUID", batchregistrationmodel);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = AttendancetrackerUtil.getJoiValidatecreate(req.body)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const batchregistrationmodel = await AttendancetrackerModel.createAttendanceTracker(req.body);
    ApiResponse.sendResponse(res, batchregistrationmodel ? 200 : 400, batchregistrationmodel ? "Creation Success" : "Creation Failed", batchregistrationmodel);
});

router.put('/:id', async (req, res) => {
    const regbatchId = parseInt(req.params.id) || 0;
    if (!regbatchId) {
        const msg = "Batches Registered: PUT Id = " + regbatchId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Batches Registered Id seems invalid", msg);
        return;
    }
    const err = AttendancetrackerUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const batchregistrationmodel = await AttendancetrackerModel.updateattendanceById(regbatchId, req.body);
    ApiResponse.sendResponse(res, batchregistrationmodel ? 200 : 400, batchregistrationmodel ? "Update Success" : "Update Failed", { status: batchregistrationmodel });
});

router.delete('/:id', async (req, res) => {
    const regbatchId = parseInt(req.params.id) || 0;
    if (!regbatchId) {
        const msg = "Batches Registered: PUT Id = " + regbatchId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Batches Registered Id seems invalid", msg);
        return;
    }
    const batchregistrationmodel = await AttendancetrackerModel.deleteattendanceById(regbatchId);
    ApiResponse.sendResponse(res, batchregistrationmodel === 1 ? 200 : 400, batchregistrationmodel === 1 ? "Delete Success" : "Deletion Failed", { status: batchregistrationmodel });
});
module.exports = router;