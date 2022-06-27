const AuthenticationDAO = require('./authentication.dao');
const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class AuthenticationUtility {


    static hasError(model, action = MyConst.ValidationModelFor.CREATE) {
        if (!model) {
            return { error: "Data Missing" };
        }

        const keys = Object.getOwnPropertyNames(model);
        if (!keys || !keys.length) {
            return { error: "Data Missing" };
        }

        const error = AuthenticationUtility.getJoiVerificationModel(action, model).validate(model);
        // console.log('Err =', error);
        return (error && error.error) ? error.error : null;
    }

    static getJoiVerificationModel(action = MyConst.ValidationModelFor.CREATE, reqBody = null) {
        if (action === MyConst.ValidationModelFor.CREATE) {
            return JOI.object({
                user_id: JOI.number().max(100).required(),
                password: JOI.string().min(5).max(64).required(),
                salt: JOI.string().required().min(3).max(100),
                created_at: JOI.date(),
                updated_at: JOI.date(),
                isActive: JOI.number().default(1)
            });
        } else {
            return JOI.object(AuthenticationUtility.generateDynamicUpdateValidator(reqBody));
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
                case "password":
                    validator[`${prop}`] = JOI.string().required().min(5).max(64); break;
                case "salt":
                    validator[`${prop}`] = JOI.string().required().min(2).max(100); break;
                case "created_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "updated_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "isActive":
                    validator[`${prop}`] = JOI.number(); break;
            }
        });
        // console.log('validator = ', validator);
        return validator;
    }

}
