const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class SessionUtil {

    /**
     * Utility method to validate the Object
     * @param model SessionModel 
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

        const error = SessionUtil.getJoiVerificationModel(action, model).validate(model);
        return (error && error.error) ? error.error : null;
    }

    static getJoiValidatecreate(model) {
        const obj = JOI.object({
            userId: JOI.number().required().min(1),
            ip: JOI.string().required().min(1),
            jwt: JOI.string().required().min(1)
        });

        const error = obj.validate(model);
        return (error && error.error) ? error.error : null;
    }

    static generateDynamicUpdateValidator(reqBody) {
        if (!reqBody) {
            return null;
        }

        const validator = {};
        const props = Object.getOwnPropertyNames(reqBody);
        props.forEach(prop => {
            switch (prop) {
                case "session_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "user_id":
                    validator[`${prop}`] = JOI.number(); break;
                case "ip_address":
                    validator[`${prop}`] = JOI.number(); break;
                case "JWT":
                    validator[`${prop}`] = JOI.number(); break;
                case "login_time":
                    validator[`${prop}`] = JOI.number(); break;
                case "updated_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "isActive":
                    validator[`${prop}`] = JOI.number(); break;
                case "uuid":
                    validator[`${prop}`] = JOI.string(); break;
            }
        });
        return validator;
    }
}