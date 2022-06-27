const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const BatchModel = require('./batch.model');

module.exports = class BatchUtil {

    /**
 * Utility method to validate the Object
 * @param model BatchModel 
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

        const error = BatchUtil.getJoiVerificationModel(action, model).validate(model);
        // console.log('Uril< has err =', error);
        return (error && error.error) ? error.error : null;
    }

    /**
* Utility function to get the Validation Schema
* @param action MyConst.ValidationModelFor DEFAULT = MyConst.ValidationModelFor.CREATE
* @returns JOI Schema
*/
    static getJoiVerificationModel(action = MyConst.ValidationModelFor.CREATE, reqBody = null) {
        if (action === MyConst.ValidationModelFor.CREATE) {
            return JOI.object({
                event_id: JOI.number().required().min(1),
                start_time: JOI.string(),
                end_time: JOI.string(),
                has_limit: JOI.number(),
                batch_size: JOI.number().min(1),
                frequency: JOI.number().min(1),
                subscription_id: JOI.number(),
                available_seats: JOI.number(),
                frequency_config: JOI.string(),
                uuid: JOI.string(),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number().default(1),
                inProgress: JOI.number().default(0),
                meeting_links: JOI.string()
            });
        } else {
            return JOI.object(BatchUtil.generateDynamicUpdateValidator(reqBody));
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
                case "batches_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "event_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "start_time":
                    validator[`${prop}`] = JOI.string(); break;
                case "end_time":
                    validator[`${prop}`] = JOI.string(); break;
                case "has_limit":
                    validator[`${prop}`] = JOI.number(); break;
                case "batch_size":
                    validator[`${prop}`] = JOI.number().min(1); break;
                case "frequency":
                    validator[`${prop}`] = JOI.number().min(1); break;
                case "available_seats":
                    validator[`${prop}`] = JOI.number(); break;
                case "frequency_config":
                    validator[`${prop}`] = JOI.string(); break;
                case "subscription_id":
                    validator[`${prop}`] = JOI.number(); break;
                case "uuid":
                    validator[`${prop}`] = JOI.string(); break;
                case "isActive":
                    validator[`${prop}`] = JOI.number(); break;
                case "inProgress":
                    validator[`${prop}`] = JOI.number(); break;
                case "created_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "updated_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "meeting_links":
                    validator[`${prop}`] = JOI.string(); break;
            }
        });
        // console.log('validator = ', validator);
        return validator;
    }

}