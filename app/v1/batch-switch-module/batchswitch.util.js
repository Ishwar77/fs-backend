const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const BatchSwitchModel = require('./batchswitch.model');

module.exports = class BatchSwitchUtil {

        /**
     * Utility method to validate the Object
     * @param model BatchSwitchModel 
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

        const error = BatchSwitchUtil.getJoiVerificationModel(action, model).validate(model);
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
            user_id: JOI.number(),
            registration_id: JOI.number(),
            batch_id: JOI.number(),
            day_of_week: JOI.string(),
            reg_batch_id: JOI.number(),
            uuid: JOI.string(),
            created_at: JOI.date().default(new Date()),
            updated_at: JOI.date().default(new Date()),
            isActive: JOI.number().default(1)
        });
    } else {
        return JOI.object(BatchSwitchUtil.generateDynamicUpdateValidator(reqBody));
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
            case "batch_switch_id":
                validator[`${prop}`] = JOI.number().required().min(1); break;
            case "user_id":
                validator[`${prop}`] = JOI.number(); break;
            case "registration_id":
                validator[`${prop}`] = JOI.number(); break;
            case "batch_id":
                validator[`${prop}`] = JOI.number(); break;
            case "reg_batch_id":
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
    return validator;
}

}