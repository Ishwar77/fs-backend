const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const FitnessCenterModel = require('./fitnesscenter.model');
module.exports = class FitnessCenterUtil {


    /**
     * Utility method to validate the Object
     * @param model FitnessCenterModel 
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
        const error = FitnessCenterUtil.getJoiVerificationModel(action, model).validate(model);
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
                place_id: JOI.number().required(),
                center_name: JOI.string().required().min(1).max(200),
                phone_number: JOI.number().required(),
                email_id: JOI.string().required().min(3).max(100),
                social_links: JOI.string().required().min(3).max(900),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number().default(1),
            });
        } else {
            return JOI.object(FitnessCenterUtil.generateDynamicUpdateValidator(reqBody));
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
                case "center_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "place_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "center_name":
                    validator[`${prop}`] = JOI.string().required().min(2).max(200); break;
                case "phone_number":
                    validator[`${prop}`] = JOI.string().required().regex(/^[0-9]{10,10}$/); break;
                case "email_id":
                    validator[`${prop}`] = JOI.string().required().min(2).max(100); break;
                case "social_links":
                    validator[`${prop}`] = JOI.string().required().min(2).max(900); break;
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