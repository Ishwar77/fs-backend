const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class EventRegisterUtil {

    /**
     * Utility method to validate the Object
     * @param model EventRegisterModel 
     * @param action  MyConst.ValidationModelFor
     * @returns null | Object
     */
    static hasError(model, action = MyConst.ValidationModelFor.CREATE) {
        if (!model) {
            return { error: "Data Missing" };
        }

        const keys = Object.getOwnPropertyNames(model);
        if (!keys || !keys.length) {
            return { error: "Data Missing" };
        }

        const error = EventRegisterUtil.getJoiVerificationModel(action, model).validate(model);
        return (error && error.error) ? error.error : null;
    }




    /**
  * Utility functio to get the Validation Schema
  * @param action MyConst.ValidationModelFor DEFAULT = MyConst.ValidationModelFor.CREATE
  * @returns JOI Schema
  */
    static getJoiVerificationModel(action = MyConst.ValidationModelFor.CREATE, reqBody = null) {
        if (action === MyConst.ValidationModelFor.CREATE) {
            return JOI.object({
                user_id: JOI.number().required().min(1),
                event_id: JOI.number().required().min(1),
                coupon_id: JOI.number(),
                final_amount: JOI.number().min(2),
                subscription_id: JOI.number().required().min(1),
                status: JOI.string().default('PENDING').max(100),
                expiry_date: JOI.date(),
                rp_orderId: JOI.any(),
                rp_paymentId: JOI.any(),
                rp_payment_response_json: JOI.any(),
                uuid: JOI.string(),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number().default(1),
            });
        } else {
            return JOI.object(EventRegisterUtil.generateDynamicUpdateValidator(reqBody));
        }
    }


    static generateDynamicUpdateValidator(reqBody) {
        if (!reqBody) {
            return null;
        }

        const validator = {};
        const props = Object.getOwnPropertyNames(reqBody);
        props.forEach(prop => {
            switch (prop) {
                case "registration_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "event_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "coupon_id":
                    validator[`${prop}`] = JOI.number(); break;
                case "final_amount":
                    validator[`${prop}`] = JOI.number(); break;
                case "expiry_date":
                    validator[`${prop}`] = JOI.date(); break;
                case "user_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "subscription_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "status":
                    validator[`${prop}`] = JOI.string().required().min(2).max(100); break;
                case "uuid":
                    validator[`${prop}`] = JOI.string(); break;
                case "isActive":
                    validator[`${prop}`] = JOI.number(); break;
                case "created_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "updated_at":
                    validator[`${prop}`] = JOI.date(); break;
            }
        });
        return validator;
    }

}