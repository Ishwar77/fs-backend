const JOI = require('@hapi/joi');

module.exports = class InvoiceObjectUtil {

    static hasError(inputModel) {
        if (!inputModel) {
            return { error: "Data Missing" };
        }

        const keys = Object.getOwnPropertyNames(inputModel);
        // console.log('Keys = ', keys);
        if (!keys || !keys.length) {
            return { error: "Data Missing" };
        }

        const error = InvoiceObjectUtil.getJoiVerificationModel().validate(inputModel);
        // console.log('Uril< has err =', error);
        return (error && error.error) ? error.error : null;
    }

    static getJoiVerificationModel() {
        return JOI.object({
            customer: JOI.object().required(),
            amount: JOI.number().required().min(1),
            receipt: JOI.any(),
            description: JOI.string(),
            notes: JOI.object(),
            type: JOI.string().default("link"),
            currency: JOI.string().default("INR"),
            sms_notify: JOI.number().default(1),
            email_notify: JOI.number().default(1),
            expire_by: JOI.any(),
            user_id: JOI.number(),
            event_id: JOI.number(),
            subscription_id: JOI.number(),
            coupon_id: JOI.number(),
            batches: JOI.string()
        });

    }

}