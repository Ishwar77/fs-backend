const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const RegistrationBatchModel = require('./event-reg-batch.model');

module.exports = class RegistrationBatchUtil { 

    /**
     * Utility method to validate the Object
     * @param model RegistrationBatchModel 
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

        const error = RegistrationBatchUtil.getJoiVerificationModel(action, model).validate(model);
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
            registration_id: JOI.number(),
            batch_id: JOI.number(),
            day_of_week: JOI.string(),
            uuid: JOI.string(),
            created_at: JOI.date().default(new Date()),
            updated_at: JOI.date().default(new Date()),
            isActive: JOI.number().default(1),
        });
    } else {
        return JOI.object(RegistrationBatchUtil.generateDynamicUpdateValidator(reqBody));
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
                case "reg_batch_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "registration_id":
                    validator[`${prop}`] = JOI.number(); break;
                case "batch_id":
                    validator[`${prop}`] = JOI.number(); break;
                case "day_of_week":
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
        // console.log('validator = ', validator);
        return validator;
    }

}