const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class SubscriptionUtil {
    
    /**
     * Utility method to validate the Object
     * @param model SubscriptionModel 
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
        const error = SubscriptionUtil.getJoiVerificationModel(action, model).validate(model);
       // console.log('Uril< has err =', error);
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
                event_id: JOI.number().required().min(1),
                days: JOI.string().required(),
                amount: JOI.string().required(),
                tax: JOI.string().required(),
                batch_count: JOI.number().required().default(1),
                duration: JOI.number().default(1),
                duration_unit: JOI.string().default("DAILY"),
                uuid: JOI.string(),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number().default(1),
            });
        } else {
            return JOI.object(SubscriptionUtil.generateDynamicUpdateValidator(reqBody));
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
                case "subscription_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "event_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "days":
                    validator[`${prop}`] = JOI.string().required(); break;
                case "amount":
                    validator[`${prop}`] = JOI.string().required(); break;
                case "tax":
                    validator[`${prop}`] = JOI.string().required(); break;
                case "batch_count":
                    validator[`${prop}`] = JOI.number(); break;
                case "duration":
                    validator[`${prop}`] = JOI.number(); break;
                case "duration_unit":
                    validator[`${prop}`] = JOI.string(); break;
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