const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const sessionModel = require('./session.model');
const sessionUtil = require('./session.util');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const sessionregistrationmodel = await sessionModel.getsession(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Sessions", sessionregistrationmodel);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const userId = parseInt(req.params.id) || 0;
    const sessionregistrationmodel = await sessionModel.getUsersbasedonuserId(userId)
    ApiResponse.sendResponse(res, 200, "Getting all Session based on user ID", sessionregistrationmodel);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = sessionUtil.getJoiValidatecreate(req.body)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const sessionregistrationmodel = await sessionModel.createSession(req.body);
    ApiResponse.sendResponse(res, sessionregistrationmodel ? 200 : 400, sessionregistrationmodel ? "Creation Success" : "Creation Failed", sessionregistrationmodel);
});

router.delete('/:id', async (req, res) => {
    const sessionId = parseInt(req.params.id) || 0;
    if (!sessionId) {
        const msg = "Batches Registered: PUT Id = " + sessionId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Batches Registered Id seems invalid", msg);
        return;
    }
    const sessionregistrationmodel = await sessionModel.deletesessionById(sessionId);
    ApiResponse.sendResponse(res, sessionregistrationmodel === 1 ? 200 : 400, sessionregistrationmodel === 1 ? "Delete Success" : "Deletion Failed", { status: sessionregistrationmodel });
});
module.exports = router;