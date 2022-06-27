const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const Authorize = require('../middlewares/authorize');
const PaymentManagerResponse = require('../../utils/razorpay/model');
const PaymetsManager = require('../../utils/razorpay/paymets-manager');
const reqIp = require("request-ip");
const InvoiceObjectUtil = require("./model");

router.get('/', /* Authorize.trainerandAdmin, */ async (req, res) => {
    const ip = reqIp.getClientIp(req);
   // console.log(ip);
    logger.warn("RP-Transaction GET, from IP = " + ip);
    ApiResponse.sendResponse(res, 405, "Not allowed");
});



router.post('/all-orders', /* Authorize.adminOnly, */ async (req, res) => {
    const fromData = req.body.from || null;
    const toData = req.body.to || null;
    const count = req.body.count ? +req.body.count : 10;
    const skip = req.body.skip ? +req.body.skip : 0;

    if (!fromData || !toData) {
        ApiResponse.sendResponse(res, 400, "Bad Inputs");
        return
    }

    try {
        const orderObj = await PaymetsManager.getAllOrders(fromData, toData, count, skip);

        if (orderObj && orderObj.status === PaymentManagerResponse.Status.SUCCESS) {
            ApiResponse.sendResponse(res, 200, orderObj.message, orderObj.metadata);
            return;
        }
        ApiResponse.sendResponse(res, 400, orderObj.message, orderObj.metadata);
        return;
    } catch (e) {
        ApiResponse.sendResponse(res, 400, "Unable to get orders ", e);
        return;
    }
});

router.post('/all-payments', /* Authorize.adminOnly, */ async (req, res) => {
    const fromData = req.body.from || null;
    const toData = req.body.to || null;
    const count = req.body.count ? +req.body.count : 10;
    const skip = req.body.skip ? +req.body.skip : 0;

    if (!fromData || !toData) {
        ApiResponse.sendResponse(res, 400, "Bad Inputs");
        return
    }

    try {
        const orderObj = await PaymetsManager.getAllPayment(fromData, toData, count, skip);

        if (orderObj && orderObj.status === PaymentManagerResponse.Status.SUCCESS) {
            ApiResponse.sendResponse(res, 200, orderObj.message, orderObj.metadata);
            return;
        }
        ApiResponse.sendResponse(res, 400, orderObj.message, orderObj.metadata);
        return;
    } catch (e) {
        ApiResponse.sendResponse(res, 400, "Unable to get Payments ", e);
        return;
    }
});

router.post('/all-invoices', /* Authorize.adminOnly, */ async (req, res) => {
    const count = req.body.count ? +req.body.count : 10;
    const skip = req.body.skip ? +req.body.skip : 0;

    // if (!fromData || !toData) {
    //     ApiResponse.sendResponse(res, 400, "Bad Inputs");
    //     return
    // }

    try {
        const orderObj = await PaymetsManager.getAllInvocies(count, skip);

        if (orderObj && orderObj.status === PaymentManagerResponse.Status.SUCCESS) {
            ApiResponse.sendResponse(res, 200, orderObj.message, orderObj.metadata);
            return;
        }
        ApiResponse.sendResponse(res, 400, orderObj.message, orderObj.metadata);
        return;
    } catch (e) {
        ApiResponse.sendResponse(res, 400, "Unable to get Invocies ", e);
        return;
    }
});

router.post('/invoice/:id', /* Authorize.adminOnly, */ async (req, res) => {
    const invoiceId = req.params.id ?  req.params.id: null;

    if (!invoiceId || !invoiceId.length) {
        ApiResponse.sendResponse(res, 400, "Bad Inputs");
        return
    }

    try {
        const orderObj = await PaymetsManager.getInvoiceById(invoiceId);

        if (orderObj && orderObj.status === PaymentManagerResponse.Status.SUCCESS) {
            ApiResponse.sendResponse(res, 200, orderObj.message, orderObj.metadata);
            return;
        }
        ApiResponse.sendResponse(res, 400, orderObj.message, orderObj.metadata);
        return;
    } catch (e) {
        ApiResponse.sendResponse(res, 400, "Unable to get Invocies ", e);
        return;
    }
});

router.post('/create-invoice', /* Authorize.adminOnly, */ async (req, res) => {
    const err = InvoiceObjectUtil.hasError(req.body);
    if( err ) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    try {
        const orderObj = await PaymetsManager.createInvoice(req.body);

        if (orderObj && orderObj.status === PaymentManagerResponse.Status.SUCCESS) {
            ApiResponse.sendResponse(res, 200, orderObj.message, orderObj.metadata);
            return;
        }
        ApiResponse.sendResponse(res, 400, orderObj.message, orderObj.metadata);
        return;
    } catch (e) {
        ApiResponse.sendResponse(res, 400, "Unable to get Invocies ", e);
        return;
    }
});




module.exports = router;