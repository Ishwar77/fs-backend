const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const InvoiceModel = require('./invoice.model');
const InvoiceUtil = require('./invoice.util');
const MyConst = require('../utils');

router.get('/', async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const invoices = await InvoiceModel.getInvoice(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Invoice", invoices);
});

router.get('/pendingids', async (req, res) => {
    const invoices = await InvoiceModel.getEmailIdOfPendingPaymentUsers()
    ApiResponse.sendResponse(res, 200, "Getting All Email-IDs", invoices);
});

router.get('/:id', async (req, res) => {
    const invoiceId = parseInt(req.params.id) || 0;
    const invoices = await InvoiceModel.getInvoiceById(invoiceId)
    ApiResponse.sendResponse(res, 200, "Getting Invoice", invoices);
});

router.get('/invoicenumber/:id', async (req, res) => {
    const invoiceId = req.params.id;
    const invoices = await InvoiceModel.getInvoiceByInvoiceNumber(invoiceId)
    ApiResponse.sendResponse(res, 200, "Getting Invoice", invoices);
});

router.get('/onemail/:id', async (req, res) => {
    const emailId = req.params.id;
    const invoices = await InvoiceModel.getInvoiceOnEmail(emailId)
    ApiResponse.sendResponse(res, 200, "Getting Invoice", invoices);
});

router.get('/status/:id', async (req, res) => {
    const status = req.params.id;
    const invoices = await InvoiceModel.getOnInvoiceStatus(status)
    ApiResponse.sendResponse(res, 200, "Getting Invoice", invoices);
});

router.post('/', async (req, res) => {
    if(!req.body) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const invoices = await InvoiceModel.addInvoice(req.body);
    ApiResponse.sendResponse(res, invoices ? 200 : 400, invoices ? "Creation Success" : "Creation Failed", invoices);
});

router.put('/:id', async (req, res) => {
    const invoiceNumber = req.params.id || null;
    if (!invoiceNumber) {
        const msg = "Invoice: PUT Id = " + invoiceNumber + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Invoice Number seems invalid", msg);
        return;
    }
    const err = InvoiceUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
//    console.log('Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Updation failed due to bad Inputs", err);
        return;
    }
   const invoices = await InvoiceModel.updateInvoiceByInvoiceNumber(invoiceNumber, req.body);
    ApiResponse.sendResponse(res, invoices ? 200 : 400, invoices ?"Update Success" : "Update Failed", {status: invoices });
});

router.post('/event', async (req, res) => {
    if(!req.body) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const invoices = await InvoiceModel.registrationWithInvoice(req.body);
    ApiResponse.sendResponse(res, invoices ? 200 : 400, invoices ? "Creation Success" : "Creation Failed", invoices);
});

router.post('/invoicereg', async (req, res) => {
    if(!req.body) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const invoices = await InvoiceModel.createEventInvoice(req.body);
    ApiResponse.sendResponse(res, 200, "Creation Success", invoices);
    // ApiResponse.sendResponse(res, invoices ? 200 : 400, invoices ? "Creation Success" : "Creation Failed", invoices);
});


router.put('/update/:id', async (req, res) => {
    const invoiceNumber = req.params.id || null;
    if (!invoiceNumber) {
        const msg = "Invoice: PUT Id = " + invoiceNumber + ", is invalid";
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Invoice Number seems invalid", msg);
        return;
    }
   const invoices = await InvoiceModel.updateInvoiceStatus(invoiceNumber);
    ApiResponse.sendResponse(res, invoices ? 200 : 400, invoices ?"Update Success" : "Update Failed", {status: invoices });
});


router.post('/eventRegistration', async (req, res) => {
    if(!req.body) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const invoices = await InvoiceModel.createEventRegistrationAfterInvoicePayment(req.body);
    ApiResponse.sendResponse(res, invoices ? 200 : 400, invoices ? "Creation Success" : "Creation Failed", invoices);
});

module.exports = router;