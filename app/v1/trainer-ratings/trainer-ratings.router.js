const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const TrainerratingModel = require('./trainer-ratings.model');
const TrainerratingUtil = require('./trainer-ratings.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const trainerratingmodel = await TrainerratingModel.getTrainerrating(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Ratings", trainerratingmodel);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const trainerId = parseInt(req.params.id) || 0;
    const trainerratingmodel = await TrainerratingModel.getbytrainerId(trainerId)
    ApiResponse.sendResponse(res, 200, "Getting all Ratings based on trainer ID", trainerratingmodel);
});

router.get('/user/:id', Authorize.verifyJWT, async (req, res) => {
    const userId = parseInt(req.params.id) || 0;
    const trainerratingmodel = await TrainerratingModel.getbyuserId(userId)
    ApiResponse.sendResponse(res, 200, "Getting all Ratings based on user Id", trainerratingmodel);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = TrainerratingUtil.getJoiValidatecreate(req.body)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const trainerratingmodel = await TrainerratingModel.createTrainerreview(req.body);
    ApiResponse.sendResponse(res, trainerratingmodel ? 200 : 400, trainerratingmodel ? "Creation Success" : "Creation Failed", trainerratingmodel);
});

router.put('/:id', async (req, res) => {
    const userId = parseInt(req.params.id) || 0;
    if (!userId) {
        const msg = "Review: PUT Id = " + userId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Review Id seems invalid", msg);
        return;
    }
    const err = TrainerratingUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Updation failed due to bad Inputs", err);
        return;
    }
    const trainerratingmodel = await TrainerratingModel.updateratingByuserId(userId, req.body);
    ApiResponse.sendResponse(res, trainerratingmodel ? 200 : 400, trainerratingmodel ? "Update Success" : "Update Failed", { status: trainerratingmodel });
});

router.delete('/:id', async (req, res) => {
    const ratingId = parseInt(req.params.id) || 0;
    if (!ratingId) {
        const msg = "Ratings: PUT Id = " + ratingId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Rating Registered Id seems invalid", msg);
        return;
    }
    const trainerratingmodel = await TrainerratingModel.deleteratingsById(ratingId);
    ApiResponse.sendResponse(res, trainerratingmodel === 1 ? 200 : 400, trainerratingmodel === 1 ? "Delete Success" : "Deletion Failed", { status: trainerratingmodel });
});
module.exports = router;