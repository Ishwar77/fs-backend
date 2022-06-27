const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const FitnessCenterModel = require('./fitnesscenter.model');
const FitnessCenterUtil = require('./fitnesscenter.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const fitnesscenters = await FitnessCenterModel.getFitnessCenter(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Fitness Center", fitnesscenters);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const fitnesscenterId = parseInt(req.params.id) || 0;
    const fitnesscenters = await FitnessCenterModel.getFitnessCenterById(fitnesscenterId)
    ApiResponse.sendResponse(res, 200, "Getting all Fitness Center", fitnesscenters);
});

router.post('/', [Authorize.verifyJWT, Authorize.adminOnly], async (req, res) => {
    
    const err = FitnessCenterUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const fitnesscenters = await FitnessCenterModel.createFitnessCenter(req.body);
    ApiResponse.sendResponse(res, fitnesscenters ? 200 : 400, fitnesscenters ? "Creation Success" : "Creation Failed", fitnesscenters);

});

router.put('/:id', [Authorize.verifyJWT, Authorize.adminOnly], async (req, res) => {
    const fitnesscenterId = parseInt(req.params.id) || 0;
    if (!fitnesscenterId) {
        const msg = "Fitness Center: PUT Id = " + fitnesscenterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Fitness Center Id seems invalid", msg);
        return;
    }

    const err = FitnessCenterUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   //console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

   const fitnesscenters = await FitnessCenterModel.updateFitnessCenterById(fitnesscenterId, req.body);
    ApiResponse.sendResponse(res, fitnesscenters ? 200 : 400, fitnesscenters ?"Update Success" : "Update Failed", {status: fitnesscenters });
});

router.delete('/:id', [Authorize.verifyJWT, Authorize.adminOnly], async (req, res) => {
    const fitnesscenterId = parseInt(req.params.id) || 0;
    if (!fitnesscenterId) {
        const msg = "Fitness Center: PUT Id = " + fitnesscenterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Fitness Center Id seems invalid", msg);
        return;
    } 
   const fitnesscenters = await FitnessCenterModel.deleteFitnessCenterById(fitnesscenterId);
    //console.log(fitnesscenters);
    ApiResponse.sendResponse(res, fitnesscenters === 1 ? 200 : 400, fitnesscenters  === 1 ?"Delete Success" : "Deletion Failed", {status: fitnesscenters });
});
module.exports = router;