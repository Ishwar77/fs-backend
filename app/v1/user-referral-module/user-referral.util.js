const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class UserReferralUtil {


    static hasError(model, action = MyConst.ValidationModelFor.CREATE) {
        if (!model) {
            return { error: "Data Missing" };
        }

        const keys = Object.getOwnPropertyNames(model);
        // console.log('Keys = ', keys);
        if (!keys || !keys.length) {
            return { error: "Data Missing" };
        }

        const error = UserReferralUtil.getJoiVerificationModel(action, model).validate(model);
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
                referrering_user: JOI.number().required().min(1),
                invited_user: JOI.number().required().min(1).disallow(JOI.ref('referrering_user')).required(),
                uuid: JOI.string(),
                points_gained: JOI.number(),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number()
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
                case "referral_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "referrering_user":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "invited_user":
                    validator[`${prop}`] = JOI.number().required().min(1).disallow(JOI.ref('referrering_user')).required(); break;
                case "uuid":
                    validator[`${prop}`] = JOI.string(); break;
                case "points_gained":
                    validator[`${prop}`] = JOI.number(); break;
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