const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class PointsMasterUtil {

/**
     * Utility method to validate the Object
     * @param model PointsMasterUtil 
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
        const error = PointsMasterUtil.getJoiVerificationModel(action, model).validate(model);
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
            action_name: JOI.string().required().max(100),
            points: JOI.number().required(),
            uuid: JOI.string(),
            created_at: JOI.date().default(new Date()),
            updated_at: JOI.date().default(new Date()),
            isActive: JOI.number().default(1),
        });
    } else {
        return JOI.object(PointsMasterUtil.generateDynamicUpdateValidator(reqBody));
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
                case "points_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "action_name":
                    validator[`${prop}`] = JOI.string().max(100); break;
                case "points":
                    validator[`${prop}`] = JOI.number().required(); break;
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