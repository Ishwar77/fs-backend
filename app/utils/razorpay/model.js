module.exports = class PaymentManagerResponse {
    static Status = {
        SUCCESS: 'SUCCESS',
        FAILURE: 'FAILURE',
        PENDING: "PENDING",
        UNKNOWN: "UNKNOWN",
    };

    constructor(status = PaymentManagerResponse.Status.PENDING, message = null, metadata = {}) {
        this.status = status;
        this.message = message;
        this.metadata = metadata;
    }
}
