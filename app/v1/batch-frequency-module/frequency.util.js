const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const FrequencyModel = require('./frequency.model');

module.exports = class FrequencyUtil {



    /**
     * Utility method to validate the Object
     * @param model FrequencyModel 
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

        const error = FrequencyUtil.getJoiVerificationModel(action, model).validate(model);
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
                frequency: JOI.string().required().min(1).max(100),
                order: JOI.string().required().min(1).max(900),
                uuid: JOI.string(),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number().default(1),
            });
        } else {
            return JOI.object(FrequencyUtil.generateDynamicUpdateValidator(reqBody));
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
                case "frequency_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "frequency":
                    validator[`${prop}`] = JOI.string().required().min(1).max(100); break;
                case "order":
                    validator[`${prop}`] = JOI.string().required().min(1).max(900); break;
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