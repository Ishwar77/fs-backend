const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const PaymentModel = require('./payment.model');
const UserModel = require('../user-module/user.model');
const PaymentUtil = require('./payment.util');
const MyConst = require('../utils');
const PaymetsManager = require('../../utils/razorpay/paymets-manager');
const Authorize = require('../middlewares/authorize');
const PaymentManagerResponse = require('../../utils/razorpay/model');
const GenerateOrderModel = require('../generate-order-module/generate-order.model');


router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const payments = await PaymentModel.getPayment(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Payment", payments);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const PaymentId = parseInt(req.params.id) || 0;
    const Payments = await PaymentModel.getPaymentById(PaymentId)
    ApiResponse.sendResponse(res, 200, "Getting all Payment", Payments);
});

router.get('/onuserid/:user_id', Authorize.verifyJWT, async (req, res) => {
    const id = req.params.user_id;
    const user = await UserModel.getUserByUUId(id);
    //console.log("USERID ", user.user_id)
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const Payments = await PaymentModel.getUserTransactionListById(user.user_id)
    ApiResponse.sendResponse(res, 200, "Getting all Payment", Payments);
});

router.post('/', async (req, res) => {

    const err = PaymentUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const Payments = await PaymentModel.createPayment(req.body);
    ApiResponse.sendResponse(res, Payments ? 200 : 400, Payments ? "Creation Success" : "Creation Failed", Payments);

});

router.put('/:id', async (req, res) => {
    const PaymentId = parseInt(req.params.id) || 0;
    if (!PaymentId) {
        const msg = "Payment: PUT Id = " + PaymentId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Payment Id seems invalid", msg);
        return;
    }

    const err = PaymentUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    //console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const Payments = await PaymentModel.updatePaymentById(PaymentId, req.body);
    ApiResponse.sendResponse(res, Payments ? 200 : 400, Payments ? "Update Success" : "Update Failed", { status: Payments });
});

router.delete('/:id', async (req, res) => {
    const PaymentId = parseInt(req.params.id) || 0;
    if (!PaymentId) {
        const msg = "Payment: PUT Id = " + PaymentId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Payment Id seems invalid", msg);
        return;
    }
    const Payments = await PaymentModel.deletePaymentById(PaymentId);
    //console.log(Payments);
    ApiResponse.sendResponse(res, Payments === 1 ? 200 : 400, Payments === 1 ? "Delete Success" : "Deletion Failed", { status: Payments });
});




router.post('/create-order', async (req, res) => {

    const err = PaymentUtil.validateOrderData(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Unable to create an order", err);
        return;
    }

    try {
        const orderObj = await PaymetsManager.createOrder(parseInt(req.body.amount), req.body.reciptId, req.body.notes);
        const genOrder = await GenerateOrderModel.createGenerateOrder(req.body);
        // console.log(genOrder);
        if (orderObj && orderObj.status === PaymentManagerResponse.Status.SUCCESS) {
            ApiResponse.sendResponse(res, 200, orderObj.message, orderObj.metadata);
            return;
        }
        ApiResponse.sendResponse(res, 400, orderObj.message, orderObj.metadata);
        return;
    } catch (e) {
        ApiResponse.sendResponse(res, 400, "Order Creation Failed", e);
        return;
    }
});


router.post('/order-info', async (req, res) => {

    const err = !req.body || !req.body.orderId || !req.body.orderId.length ? true : false;

    if (err) {
        ApiResponse.sendResponse(res, 400, "Unable to get order info", err);
        return;
    }

    try {
        const orderObj = await PaymetsManager.getOrderInfoByOrderId(req.body.orderId);
        if (orderObj && orderObj.status === PaymentManagerResponse.Status.SUCCESS) {
            ApiResponse.sendResponse(res, 200, orderObj.message, orderObj.metadata);
            return;
        }
        ApiResponse.sendResponse(res, 400, orderObj.message, orderObj.metadata);
        return;
    } catch (e) {
        ApiResponse.sendResponse(res, 400, "Order Details not found", e);
        return;
    }
});

router.post('/payment-info', async (req, res) => {

    const orderId = req.body.orderId || null;
    const paymentId = req.body.paymentId || null;

    if (!orderId && !paymentId) {
        ApiResponse.sendResponse(res, 400, "Unable fetch payment information", err);
        return;
    }

    try {
        let orderObj = paymentId ? await PaymetsManager.getPaymentInfoByPaymentId(paymentId) :
            await PaymetsManager.getPaymentInfoByOrderId(orderId);

            if(orderObj && orderObj.status === PaymentManagerResponse.Status.SUCCESS) {
                ApiResponse.sendResponse(res, 200, `Payment Details, for ` +
                orderId ? `Order Id '${orderId}' ` : `PaymentId '${paymentId}'`, orderObj.metadata);
            } else {
                ApiResponse.sendResponse(res, 400, orderObj.message , orderObj.metadata);
            }
        return;
    } catch (e) {
        ApiResponse.sendResponse(res, 400, `No Payment Details, for ` +
            orderId ? `Order Id '${orderId}' ` : `PaymentId '${paymentId}'`, e);
        return;
    }
});

router.post('/capture-payment', async (req, res) => {

    const amount = req.body.amount || null;
    const paymentId = req.body.paymentId || null;
    const currency = req.body.currency || 'INR'

    if (!amount || !paymentId) {
        ApiResponse.sendResponse(res, 400, "Unable capture payment information");
        return;
    }

    try {
        const orderObj = await PaymetsManager.capturePaymentByPaymentId(paymentId, amount, currency);

        if (!orderObj || orderObj.status === PaymentManagerResponse.Status.FAILURE) {
            ApiResponse.sendResponse(res, 400, `No Payment Details, for PaymentId '${paymentId}'`, orderObj.metadata);
            return false;
        }
        // Update Payment table
        const Payments = await PaymentModel.updatePaymentByRazorPayPaymentId(paymentId, { payment_status: 'CAPTURED' });
        if(Payments && Payments === 'SUCCESS') {
            ApiResponse.sendResponse(res, 200, `Payment Status PaymentId '${paymentId}'`, Payments);
        } else {
            ApiResponse.sendResponse(res, 400, `Filed to capture payments, for PaymentId '${paymentId}'`, Payments);
        }
        return;
    } catch (e) {
        ApiResponse.sendResponse(res, 400, `Unable to capture Payment Details, for PaymentId '${paymentId}'`, e);
        return;
    }
});


router.post('/refund', async (req, res) => {

    const amount = req.body.amount || null;
    const paymentId = req.body.paymentId || null;
    const notes = req.body.note || null

    if (!amount && !paymentId) {
        ApiResponse.sendResponse(res, 400, "Unable make refund action", err);
        return;
    }

    try {
        let orderObj = await PaymetsManager.refundPayment(paymentId, amount, notes);
        if (orderObj && orderObj.status === PaymentManagerResponse.Status.SUCCESS) {
            ApiResponse.sendResponse(res, 200, `Refund request Placed, for PaymentId '${paymentId}'`, orderObj.metadata);
            return;
        }
        ApiResponse.sendResponse(res, 400, orderObj.message, orderObj.metadata);
        return;

    } catch (e) {
        ApiResponse.sendResponse(res, 400, `Unable to place the refund request, for PaymentId '${paymentId}'`, e);
        return;
    }
});




module.exports = router;