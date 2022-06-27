const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const FrequencyModel = require('./frequency.model');
const FrequencyUtil = require('./frequency.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const frequencymodel = await FrequencyModel.getFrequency(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Frequency", frequencymodel);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const frequencyId = parseInt(req.params.id) || 0;
    const frequencymodel = await FrequencyModel.getFrequencyById(frequencyId)
    ApiResponse.sendResponse(res, 200, "Getting Frequency on ID", frequencymodel);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = FrequencyUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const frequencymodel = await FrequencyModel.createFrequency(req.body);
    ApiResponse.sendResponse(res, frequencymodel ? 200 : 400, frequencymodel ? "Creation Success" : "Creation Failed", frequencymodel);
});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const frequencyId = parseInt(req.params.id) || 0;
    if (!frequencyId) {
        const msg = "Frequency: PUT Id = " + frequencyId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Frequency Id seems invalid", msg);
        return;
    }
    const err = FrequencyUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
//    console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const frequencymasters = await FrequencyModel.updateFrequencyById(frequencyId, req.body);
    ApiResponse.sendResponse(res, frequencymasters ? 200 : 400, frequencymasters ?"Update Success" : "Update Failed", {status: frequencymasters });
});

router.delete('/:id', async (req, res) => {
    const frequencyId = parseInt(req.params.id) || 0;
    if (!frequencyId) {
        const msg = "Frequency: DELETE Id = " + frequencyId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Frequency Id seems invalid", msg);
        return;
    } 
   const frequencymodels = await FrequencyModel.deleteFrequencyById(frequencyId);
    // console.log(frequencymodels);
    ApiResponse.sendResponse(res, frequencymodels === 1 ? 200 : 400, frequencymodels  === 1 ?"Delete Success" : "Deletion Failed", {status: frequencymodels });
});



//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const frequencies = await FrequencyModel.getFrequencyByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting frequencies", frequencies);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = FrequencyUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const frequencies = await FrequencyModel.updateFrequencyByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, frequencies ? 200 : 400, frequencies ? "Update Success" : "Update Failed", { status: frequencies });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const frequencies = await FrequencyModel.deleteFrequencyByUUId(req.params.id);
    ApiResponse.sendResponse(res, frequencies === 1 ? 200 : 400, frequencies === 1 ? "Delete Success" : "Deletion Failed", { status: frequencies });
});
module.exports = router;