const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class UserPointsUtil {


    static hasError(model, action = MyConst.ValidationModelFor.CREATE) {
        if (!model) {
            return { error: "Data Missing" };
        }

        const keys = Object.getOwnPropertyNames(model);
        // console.log('Keys = ', keys);
        if (!keys || !keys.length) {
            return { error: "Data Missing" };
        }

        const error = UserPointsUtil.getJoiVerificationModel(action, model).validate(model);
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
                user_id: JOI.number().required().min(1),
                uuid: JOI.string(),
                credited_points: JOI.number().default(0),
                debited_points: JOI.number().default(0),
                balance_points: JOI.number().default(0),
                comment: JOI.string().default(null),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number().default(1)
            });
        } else {
            return JOI.object(UserReferralUtil.generateDynamicUpdateValidator(reqBody));
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
                case "id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "user_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "uuid":
                    validator[`${prop}`] = JOI.string(); break;
                case "credited_points":
                    validator[`${prop}`] = JOI.number().required().min(0); break;
                case "debited_points":
                    validator[`${prop}`] = JOI.number().required().min(0); break;
                case "balance_points":
                    validator[`${prop}`] = JOI.number().required().min(0); break;
                case "isActive":
                    validator[`${prop}`] = JOI.number().required().default(1); break;
                case "created_at":
                    validator[`${prop}`] = JOI.date().default(new Date()); break;
                case "updated_at":
                    validator[`${prop}`] = JOI.date().default(new Date()); break;
            }
        });
        // console.log('validator = ', validator);
        return validator;
    }

}