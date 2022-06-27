const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class UserUtil {

    static hasError(model, action = MyConst.ValidationModelFor.CREATE) {
        if (!model) {
            return { error: "Data Missing" };
        }

        const keys = Object.getOwnPropertyNames(model);
        // console.log('Keys = ', keys);
        if (!keys || !keys.length) {
            return { error: "Data Missing" };
        }

        const error = UserUtil.getJoiVerificationModel(action, model).validate(model);
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
                user_role_id: JOI.number().required().min(1),
                address_id: JOI.number().required().min(1),
                diaplay_name: JOI.string().min(3).max(100),
                pageName: JOI.string().default('null').max(100),
                mobile_number: JOI.string().min(3).max(100),
                email_id: JOI.string().email().required().min(10).max(100),
                profile_picture_url: JOI.string().min(3).max(100).default('null'),
                referral_code: JOI.string().default('null'),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number(),
                gender: JOI.string().min(1).max(10).default('N/A'),
                dob: JOI.date().default(new Date()),
                designation: JOI.string(),
                expertise_in: JOI.string(),
                uuid: JOI.string(),
                experience: JOI.number(),
                location: JOI.string()
            });
        } else {
            return JOI.object(UserUtil.generateDynamicUpdateValidator(reqBody));
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
                case "user_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "user_role_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "address_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "pageName":
                    validator[`${prop}`] = JOI.string().default('null').max(100); break;
                case "experience":
                    validator[`${prop}`] = JOI.number(); break;
                case "location":
                    validator[`${prop}`] = JOI.string(); break;
                case "diaplay_name":
                    validator[`${prop}`] = JOI.string().min(3).max(100); break;
                case "mobile_number":
                    validator[`${prop}`] = JOI.string().min(3).max(100); break;
                case "email_id":
                    validator[`${prop}`] = JOI.string().email().min(3).max(100); break;
                case "profile_picture_url":
                    validator[`${prop}`] = JOI.string().min(3).max(100); break;
                case "referral_code":
                    validator[`${prop}`] = JOI.string(); break;
                case "gender":
                    validator[`${prop}`] = JOI.string().min(1).max(10).default('N/A'); break;
                case "dob":
                    validator[`${prop}`] = JOI.date(); break;
                case "designation":
                    validator[`${prop}`] = JOI.string().min(1).max(50); break;
                case "expertise_in":
                    validator[`${prop}`] = JOI.string(); break;
                case "isActive":
                    validator[`${prop}`] = JOI.number(); break;
                case "created_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "updated_at":
                    validator[`${prop}`] = JOI.date(); break;
                case "uuid":
                    validator[`${prop}`] = JOI.string(); break;

            }
        });
        // console.log('validator = ', validator);
        return validator;
    }

}