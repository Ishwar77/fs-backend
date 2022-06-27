const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const GenerateOrderModel = require('./generate-order.model');
const GenerateOrderUtil = require('./generate-order.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const generatedOrders = await GenerateOrderModel.getGeneratedOrders(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Generated Orders", generatedOrders);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const genOrderId = parseInt(req.params.id) || 0;
    const generatedOrders = await GenerateOrderModel.getGenerateOrdersById(genOrderId)
    ApiResponse.sendResponse(res, 200, "Getting all Generated Orders", generatedOrders);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = GenerateOrderUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const generatedOrders = await GenerateOrderModel.createGenerateOrder(req.body);
    ApiResponse.sendResponse(res, generatedOrders ? 200 : 400, generatedOrders ? "Creation Success" : "Creation Failed", generatedOrders);
});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const genOrderId = parseInt(req.params.id) || 0;
    if (!genOrderId) {
        const msg = "Generated Orders: PUT Id = " + genOrderId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Generated Orders Id seems invalid", msg);
        return;
    }
    const err = GenerateOrderUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const generatedOrders = await GenerateOrderModel.updateGenerateOrdersById(genOrderId, req.body);
    ApiResponse.sendResponse(res, generatedOrders ? 200 : 400, generatedOrders ?"Update Success" : "Update Failed", {status: generatedOrders });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const genOrderId = parseInt(req.params.id) || 0;
    if (!genOrderId) {
        const msg = "Generated Orders: PUT Id = " + genOrderId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Generated Orders Id seems invalid", msg);
        return;
    } 
   const generatedOrders = await GenerateOrderModel.deleteMediaMasterById(genOrderId);
    ApiResponse.sendResponse(res, generatedOrders === 1 ? 200 : 400, generatedOrders  === 1 ?"Delete Success" : "Deletion Failed", {status: generatedOrders });
});


module.exports = router;