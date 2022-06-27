const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const PaymentModel = require('./payment.model');

module.exports = class PaymentUtil {



    /**
     * Utility method to validate the Object
     * @param model PaymentModel 
     * @param action  MyConst.ValidationModelFor
     * @returns null | Object
     */
    static hasError(model, action = MyConst.ValidationModelFor.CREATE) {
        if (!model) {
            return { error: "Data Missing" };
        }

        const keys = Object.getOwnPropertyNames(model);
       // console.log('Keys = ', keys);
        if (!keys || !keys.length) {
            return { error: "Data Missing" };
        }

        const error = PaymentUtil.getJoiVerificationModel(action, model).validate(model);
       // console.log('Uril< has err =', error);
        return (error && error.error) ? error.error : null;
    }


   static validateOrderData(reqBody) {
        if(!reqBody || !Object.getOwnPropertyNames(reqBody).length) {
            return false;
        }

       const schema = JOI.object({
            amount: JOI.number().required().min(1),
            reciptId: JOI.string().required().min(1),
            notes: JOI.object()
        });
        const error = schema.validate(reqBody);
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
                subscription_id: JOI.number().min(1),
                order_id: JOI.string().required(),
                payment_id: JOI.string().required(),
                payment_status: JOI.string().required(),
                signature: JOI.string().required(),
                uuid: JOI.string(),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number().default(1),
                registration_id: JOI.number(),
                advertisement_id: JOI.number()
            });
        } else {
            return JOI.object(PaymentUtil.generateDynamicUpdateValidator(reqBody));
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
                case "slno":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "user_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "subscription_id":
                    validator[`${prop}`] = JOI.number().min(1); break;
                case "order_id":
                    validator[`${prop}`] = JOI.string().required(); break;
                case "payment_id":
                    validator[`${prop}`] = JOI.string().required(); break;
                case "payment_status":
                    validator[`${prop}`] = JOI.string().required(); break;
                case "signature":
                    validator[`${prop}`] = JOI.string().required(); break;
                case "registration_id":
                    validator[`${prop}`] = JOI.number(); break;
                case "advertisement_id":
                    validator[`${prop}`] = JOI.number(); break;
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
        // console.log('validator = ', validator);
        return validator;
    }

}