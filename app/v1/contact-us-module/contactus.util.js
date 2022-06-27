const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const ContactUsModel = require('./contactus.model');

module.exports = class ContactUsUtil {

    /**
     * Utility method to validate the Object
     * @param model ContactUsModel 
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

        const error = ContactUsUtil.getJoiVerificationModel(action, model).validate(model);
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
                full_name: JOI.string().required().min(1).max(50),
                email: JOI.string().required().min(3).max(100),
                mobile_number: JOI.string().required().min(3).max(30),
                subject: JOI.string().required().min(3).max(100),
                message: JOI.string().required().min(3).max(500),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number().default(1),
            });
        } else {
            return JOI.object(ContactUsUtil.generateDynamicUpdateValidator(reqBody));
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
                case "contact_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "full_name":
                    validator[`${prop}`] = JOI.string().required().min(1).max(50); break;
                case "email":
                    validator[`${prop}`] = JOI.string().required().min(3).max(100); break;
                case "mobile_number":
                    validator[`${prop}`] = JOI.string().required().min(3).max(30); break;
                case "subject":
                    validator[`${prop}`] = JOI.string().required().min(3).max(100); break;
                case "message":
                    validator[`${prop}`] = JOI.string().required().min(3).max(500); break;
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