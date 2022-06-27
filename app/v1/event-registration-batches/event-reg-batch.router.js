const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const RegistrationBatchModel = require('./event-reg-batch.model');
const RegistrationBatchUtil = require('./event-reg-batch.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const BatchModel = require('../batch/batch.model');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const batchregistrationmodel = await RegistrationBatchModel.getRegiteredBatches(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Batches Registered", batchregistrationmodel);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const regbatchId = parseInt(req.params.id) || 0;
    const batchregistrationmodel = await RegistrationBatchModel.getRegisteredBatchById(regbatchId)
    ApiResponse.sendResponse(res, 200, "Getting all Batches Registered", batchregistrationmodel);
});

router.get('/getonregid/:id/batch/:batch_id', Authorize.verifyJWT, async (req, res) => {
    const regId = parseInt(req.params.id) || 0;
    const batchId = parseInt(req.params.batch_id) || 0;
    const batchregistrationmodel = await RegistrationBatchModel.getdetailsOnRegistrationId(regId, batchId)
    ApiResponse.sendResponse(res, 200, "Getting all Batches Registered", batchregistrationmodel);
});

router.get('/regid/:id', Authorize.verifyJWT, async (req, res) => {
    const regId = parseInt(req.params.id) || 0;
    const batchregistrationmodel = await RegistrationBatchModel.getdetailsOnlyOnRegId(regId)
    ApiResponse.sendResponse(res, 200, "Getting all Batches Registered", batchregistrationmodel);
});

router.get('/batches/:id', Authorize.verifyJWT, async (req, res) => {
    const batchuuid = req.params.id || null;
    const batch = await BatchModel.getBatchByUUID(batchuuid);
   // console.log(batch[0].batches_id);
    if(!batch || !batch[0].batches_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
  //  const batchId = parseInt(req.params.id) || 0;
    const batchmodel = await RegistrationBatchModel.getUsersbasedonbatchId(batch[0].batches_id)
   // const batchmodel = await RegistrationBatchModel.getUsersbasedonbatchId(batchId)
    ApiResponse.sendResponse(res, 200, "Getting all the users for particular batch", batchmodel);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = RegistrationBatchUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const batchregistrationmodel = await RegistrationBatchModel.createBatchRegistration(req.body);
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
    const err = RegistrationBatchUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   // console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const batchregistrationmodel = await RegistrationBatchModel.updateRegisteredBatchById(regbatchId, req.body);
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
    const batchregistrationmodel = await RegistrationBatchModel.deleteRegisteredBatchById(regbatchId);
    ApiResponse.sendResponse(res, batchregistrationmodel === 1 ? 200 : 400, batchregistrationmodel === 1 ? "Delete Success" : "Deletion Failed", { status: batchregistrationmodel });
});



//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const batchregistrationmodel = await RegistrationBatchModel.getRegisteredBatchByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting batchregistrationmodel", batchregistrationmodel);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = RegistrationBatchUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const batchregistrationmodel = await RegistrationBatchModel.updateRegisteredBatchByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, batchregistrationmodel ? 200 : 400, batchregistrationmodel ? "Update Success" : "Update Failed", { status: batchregistrationmodel });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const batchregistrationmodel = await RegistrationBatchModel.deleteRegisteredBatchByUUId(req.params.id);
    ApiResponse.sendResponse(res, batchregistrationmodel === 1 ? 200 : 400, batchregistrationmodel === 1 ? "Delete Success" : "Deletion Failed", { status: batchregistrationmodel });
});
module.exports = router;