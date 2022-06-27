/**
 * @see https://razorpay.com/docs/invoices/api/create/
 */
const moment = require("moment");

module.exports = {
    /**
     * REQUIRED Payment Collected by
     */
    customer: {
        name: null,
        email: null,
        contact: null
    },
    amount: 0,
    description: null,
    receipt: null,
    /** Include the details about this invoice as a simple JSON object */
    notes: null,
    /** DONT CHANGE */
    type: "link",
    /** DONT CHANGE */
    currency: "INR",
    sms_notify: 1,
    email_notify: 1,
    /** DEFAULT Invoice Expiry = 1 Hour */
    expire_by: moment().add(1, 'hours').unix(), // expires by next 1Hrs
    user_id: 0,
    event_id: 0,
    subscription_id: 0,
    coupon_id: 0,
    batches: null
};

