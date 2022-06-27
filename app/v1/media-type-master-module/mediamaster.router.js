const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const MediaMasterModel = require('./mediamaster.model');
const MediaMasterUtil = require('./mediamaster.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const mediatypes = await MediaMasterModel.getMediaMaster(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Media Model", mediatypes);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const mediamasterId = parseInt(req.params.id) || 0;
    const mediamasters = await MediaMasterModel.getMediaMasterById(mediamasterId)
    ApiResponse.sendResponse(res, 200, "Getting all Media Masters", mediamasters);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = MediaMasterUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const mediamasters = await MediaMasterModel.createMediaMaster(req.body);
    ApiResponse.sendResponse(res, mediamasters ? 200 : 400, mediamasters ? "Creation Success" : "Creation Failed", mediamasters);
});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const mediamasterId = parseInt(req.params.id) || 0;
    if (!mediamasterId) {
        const msg = "Media Master: PUT Id = " + mediamasterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Media Master Id seems invalid", msg);
        return;
    }
    const err = MediaMasterUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   //console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const mediamasters = await MediaMasterModel.updateMediaMasterById(mediamasterId, req.body);
    ApiResponse.sendResponse(res, mediamasters ? 200 : 400, mediamasters ?"Update Success" : "Update Failed", {status: mediamasters });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const mediamasterId = parseInt(req.params.id) || 0;
    if (!mediamasterId) {
        const msg = "Media Master: PUT Id = " + mediamasterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Media Master Id seems invalid", msg);
        return;
    } 
   const mediamasters = await MediaMasterModel.deleteMediaMasterById(mediamasterId);
    //console.log(mediamasters);
    ApiResponse.sendResponse(res, mediamasters === 1 ? 200 : 400, mediamasters  === 1 ?"Delete Success" : "Deletion Failed", {status: mediamasters });
});


//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const mediamasters = await MediaMasterModel.getMediaMasterByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting mediamasters", mediamasters);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = MediaMasterUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const mediamasters = await MediaMasterModel.updateMediaMasterByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, mediamasters ? 200 : 400, mediamasters ? "Update Success" : "Update Failed", { status: mediamasters });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const mediamasters = await MediaMasterModel.deleteMediaMasterByUUId(req.params.id);
    ApiResponse.sendResponse(res, mediamasters === 1 ? 200 : 400, mediamasters === 1 ? "Delete Success" : "Deletion Failed", { status: mediamasters });
});
module.exports = router;