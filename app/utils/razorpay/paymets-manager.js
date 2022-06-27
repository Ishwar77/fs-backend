const config = require('config');
const logger = require('../logger');
const Helper = require('../helper');
const RazorPay = require('razorpay');
const PaymentResponse = require('./model');

class PaymetsManager {

    /** Utility function to store load keys into Static variables  */
    static loadKeys() {

        if (!PaymetsManager.APP_KEY) {
            PaymetsManager.APP_KEY = config.get('razorPayAppKey');
            logger.info("Payments APP_KEY loaded " + PaymetsManager.APP_KEY);
        }
        if (!PaymetsManager.SECRET_KEY) {
            PaymetsManager.SECRET_KEY = config.get('razorPaySecretKey') || 'pKcHmJyQSTKs14VyY3I0tANb';
            logger.info("Payments SECRET_KEY loaded " + PaymetsManager.SECRET_KEY);
        }
    }

    /**  To initilize the Payments and create an Instance */
    static initilize() {
        logger.info("Initilizing PaymentsManager ");

        try {
            // 1. Load Keys
            PaymetsManager.loadKeys();

            // 2. Create the Instance
            PaymetsManager.getInstance();

        } catch (e) {
            logger.error("Failed to initilize the 'PaymetsManager'");
            logger.error(e);
        }
    }

    /** Initilizes and returns the Payment instance */
    static getInstance() {
        if (!PaymetsManager.RazorPay) {
            PaymetsManager.RazorPay = new RazorPay({
                key_id: PaymetsManager.APP_KEY,
                key_secret: PaymetsManager.SECRET_KEY
            });
        }
        return PaymetsManager.RazorPay;
    }

    /**
     * Function to Create a Razor Pay Order
     * @param {*} amount number in PAISE REQUIRED
     * @param {*} reciptId string REQUIRED
     * @param {*} notes object OPTIONAL
     * @param {*} currency string OPTIONAL DEFAULT = 'INR
     * @returns Promise<PaymentManagerResponse>
     * @see https://github.com/razorpay/razorpay-node/wiki#instanceorderscreateamount-currency-receipt-payment_capture-notes
     */

    static async createOrder(amount, reciptId, notes = null, currency = 'INR') {

        if (!amount || !reciptId) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Amount and Recipt Id is required"));
        }
        let order = null;
        try {
            const obj = {
                amount: amount,
                receipt: reciptId,
                payment_capture: '1',
                currency: currency || 'INR',
            };
            if(notes) {
                obj['notes'] = notes;
            }
            console.log('Order Obj = ', obj);

            order = await PaymetsManager.getInstance().orders.create(obj);
            // console.log('Order Obj = ', order);
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, "Order creation success", order));
        } catch (e) {
            console.log('Order Create = ', e);
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Failed to create the order", e));
        }
    }

    /**
     * To get full information by OrderId
     * @param orderId string
     * @returns Promise<PaymentManagerResponse>
     */
    static async getOrderInfoByOrderId(orderId) {
        if (!orderId || !orderId.trim().length) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "OrderId was expected, found " + orderId || 'null'));
        }
        let info = null;
        try {
            info = await PaymetsManager.getInstance().orders.fetch(orderId);
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, "Order Details for" + orderId, info));
        } catch (e) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Failed get order details of Order Id " + orderId, e));
        }
    }

      /**
     * To get All the Order details, between given date range
     * @param {*} fromDate String 'yyyy-MM-dd'
     * @param {*} toDate String 'yyyy-MM-dd'
     * @param {*} count number 10
     * @param {*} skip number 0
     * @see https://github.com/razorpay/razorpay-node/wiki#instanceordersallfrom-to-count-skip-authorized-receipt
     */
    static async getAllOrders(fromDate = null, toDate = null, count = 10, skip = 0) {
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDay()} `;

        fromDate = fromDate ||  dateStr;
        toDate = toDate || dateStr;

        try {
            const info = await PaymetsManager.getInstance().orders.all({from: fromDate, to: toDate, count: count, skip: skip});
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, `Order Details between date range ${fromDate}, to ${toDate}`, info));
        } catch (e) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, `Failed to get order details between date range ${fromDate}, to ${toDate}`, e));
        }
    }


    /**
     * To get all Payment related information w.r.t. an Order
     * @param orderId string
     * @returns Promise<PaymentManagerResponse>
     */
    static async getPaymentInfoByOrderId(orderId) {
        if (!orderId || !orderId.trim().length) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "OrderId was expected, found " + orderId || 'null'));
        }
        let info = null;
        try {
            info = await PaymetsManager.getInstance().orders.fetchPayments(orderId);
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, "Payment Details for the OrderId" + orderId, info));
        } catch (e) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Failed get Payment details of OrderId " + orderId, e));
        }
    }

    /**
     * To get all Payment related information w.r.t. Payment
     * @param paymentId string
     * @returns Promise<PaymentManagerResponse>
     */
    static async getPaymentInfoByPaymentId(paymentId) {
        if (!paymentId || !paymentId.trim().length) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "PaymentId was expected, found " + paymentId || 'null'));
        }
        let info = null;
        try {
            info = await PaymetsManager.getInstance().payments.fetch(paymentId);
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, "Payment Details for the PaymentId" + paymentId, info));
        } catch (e) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Failed get Payment details of PaymentId " + paymentId, e));
        }
    }


    /**
     * To get All the Payment details, between given date range
     * @param {*} fromDate String 'yyyy-MM-dd'
     * @param {*} toDate String 'yyyy-MM-dd'
     * @param {*} count number 10, Number of recoards to get
     * @param {*} skip number 0, number of recoards to skip 
     * @see https://github.com/razorpay/razorpay-node/wiki#instancepaymentsallfrom-to-count-skip
     */
    static async getAllPayment(fromDate = null, toDate = null, count = 10, skip = 0) {
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDay()} `;

        fromDate = fromDate ||  dateStr;
        toDate = toDate || dateStr;

        try {
            const info = await PaymetsManager.getInstance().payments.all({from: fromDate, to: toDate, count: count, skip: skip});
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, `Payment Details between date range ${fromDate}, to ${toDate}`, info));
        } catch (e) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, `Failed to get payment details between date range ${fromDate}, to ${toDate}`, e));
        }
    }

    /**
     * To Capture a Payment
     * @param paymentId string
     * @param amount number paise
     * @param currency string OPTIONAL, DEFAULT = 'INR'
     * @returns Promise<PaymentManagerResponse>
     */
    static async capturePaymentByPaymentId(paymentId, amount, currency = 'INR') {
        if (!paymentId || !paymentId.trim().length || !amount) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "PaymentId and Amount was expected, found "));
        }
        let info = null;
        try {
            info = await PaymetsManager.getInstance().payments.capture(paymentId, amount, currency);
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, "Payment Details has been captured, for PaymentId" + paymentId, info));
        } catch (e) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Failed capture Payment details, for PaymentId " + paymentId, e));
        }
    }

    /**
    * To Refund a Payment
    * @param paymentId string
    * @param amount number in paise
    * @param note object OPTIONAL
    * @returns Promise<PaymentManagerResponse>
    */
    static async refundPayment(paymentId, amount, notes = null) {
        if (!paymentId || !paymentId.trim().length || !amount) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "PaymentId and Amount was expected, found "));
        }
        let info = null;
        try {
            info = await PaymetsManager.getInstance().payments.refund(paymentId, { amount, notes });
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, "Payment Refund Initiated, for PaymentId" + paymentId, info));
        } catch (e) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Payment Refund failed, for PaymentId " + paymentId, e));
        }
    }


    /**
     * Function to Create a Razor Pay Invoice
     * @param {*} invoiceObj invoice-obj
     * @returns Promise<PaymentManagerResponse>
     * @see https://github.com/razorpay/razorpay-node/wiki#invoices
     * @see https://razorpay.com/docs/invoices/api/#creating-an-invoice
     */
    static async createInvoice(invoiceObj) {
        if(!invoiceObj || !invoiceObj.customer || !invoiceObj.amount || !invoiceObj.customer.contact) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "All Fields in Invoice object is mandetory", invoiceObj));
        }
        let info = null;
        try {
            info = await PaymetsManager.getInstance().invoices.create(invoiceObj);
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, "Invoice Created", info));
        } catch (e) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Unable to generate Invoice", e));
        }
    }


    static async getInvoiceById(invoideId) {
        if(!invoideId || !invoideId.length ) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Invoide Id is missing"));
        }
        let info = null;
        try {
            info = await PaymetsManager.getInstance().invoices.fetch(invoideId);
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, "Invoice Details", info));
        } catch (e) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Unable to get Invoice", invoideId));
        }
    }

    /**
     * @see https://razorpay.com/docs/invoices/api/fetch/
     */
    static async getAllInvocies( count = 10, skip = 0) {
        let info = null;
        try {
            info = await PaymetsManager.getInstance().invoices.all({ count: count, skip: skip});
            return (new PaymentResponse(PaymentResponse.Status.SUCCESS, "All Invoices", info));
        } catch (e) {
            return (new PaymentResponse(PaymentResponse.Status.FAILURE, "Unable to get Invoices"));
        }
    }


}

PaymetsManager.initilize();
module.exports = PaymetsManager;