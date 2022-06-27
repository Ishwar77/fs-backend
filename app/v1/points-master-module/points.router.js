const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const PointsMasterModel = require('./points.model');
const PointsMasterUtil = require('./points.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const pointsmodels = await PointsMasterModel.getPointsMaster(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Points Master", pointsmodels);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const pointsId = parseInt(req.params.id) || 0;
    const pointsmodels = await PointsMasterModel.getPointsMasterById(pointsId)
    ApiResponse.sendResponse(res, 200, "Getting all Points Master on ID", pointsmodels);
});

router.post('/', Authorize.adminOnly, async (req, res) => {
    const err = PointsMasterUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const pointsmodels = await PointsMasterModel.createPointsMaster(req.body);
    ApiResponse.sendResponse(res, pointsmodels ? 200 : 400, pointsmodels ? "Creation Success" : "Creation Failed", pointsmodels);
});

router.put('/:id', Authorize.adminOnly, async (req, res) => {
    const pointsId = parseInt(req.params.id) || 0;
    if (!pointsId) {
        const msg = "Points Master: PUT Id = " + pointsId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Points Master Id seems invalid", msg);
        return;
    }
    const err = PointsMasterUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   //console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const pointsmodels = await PointsMasterModel.updatePointsMasterById(pointsId, req.body);
    ApiResponse.sendResponse(res, pointsmodels ? 200 : 400, pointsmodels ?"Update Success" : "Update Failed", {status: pointsmodels });
});

router.delete('/:id', Authorize.adminOnly, async (req, res) => {
    const pointsId = parseInt(req.params.id) || 0;
    if (!pointsId) {
        const msg = "Points Master: PUT Id = " + pointsId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Points Master Id seems invalid", msg);
        return;
    } 
   const pointsmodels = await PointsMasterModel.deletePointsMasterById(pointsId);
    ApiResponse.sendResponse(res, pointsmodels === 1 ? 200 : 400, pointsmodels  === 1 ?"Delete Success" : "Deletion Failed", {status: pointsmodels });
});


//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const pointsmodels = await PointsMasterModel.getPointsMasterByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Points Master", pointsmodels);
});


router.put('/updateonuuid/:id', Authorize.adminOnly, async (req, res) => {
    const err = PointsMasterUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const pointsmodels = await PointsMasterModel.updatePointsMasterByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, pointsmodels ? 200 : 400, pointsmodels ? "Update Success" : "Update Failed", { status: pointsmodels });
});


router.delete('/deleteonuuid/:id', Authorize.adminOnly, async (req, res) => {
    const pointsmodels = await PointsMasterModel.deletePointsMasterByUUId(req.params.id);
    ApiResponse.sendResponse(res, pointsmodels === 1 ? 200 : 400, pointsmodels === 1 ? "Delete Success" : "Deletion Failed", { status: pointsmodels });
});
module.exports = router;