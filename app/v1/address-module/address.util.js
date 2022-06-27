const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const AddressModel = require('./address.model');

module.exports = class AddressUtil {

    static getObjectFromRequest(reqBody) {
        if (!reqBody) {
            return null;
        }
        return new AddressModel(reqBody["place"] || null, reqBody["district"] || null, reqBody["state"] || null, reqBody["country"] ||  null, reqBody["pin_code"] || -1, reqBody["uuid"] || null, reqBody["created_at"] || null, reqBody["isActive"] || 1, reqBody["updated_at"] || null);
    }


    /**
     * Utility method to validate the Object
     * @param model AddressModel 
     * @param action  MyConst.ValidationModelFor
     * @returns null | Object
     */
    static hasError(model, action = MyConst.ValidationModelFor.CREATE) {
        if (!model) {
            return {error: "Data Missing"};
        }

        const keys = Object.getOwnPropertyNames(model);
        if(!keys || !keys.length) {
            return {error: "Data Missing"};
        }

        const error = AddressUtil.getJoiVerificationModel(action, model).validate(model);
       // console.log('Err =', error);
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
                place: JOI.string().required().min(3).max(100),
                district: JOI.string().required().min(3).max(100),
                state: JOI.string().required().min(3).max(100),
                country: JOI.string().required().min(3).max(100),
                pin_code: JOI.number().required(),
                uuid: JOI.string()
            });
        } else {
           return JOI.object( AddressUtil.generateDynamicUpdateValidator(reqBody) );
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
                case "place":
                    validator[`${prop}`] = JOI.string().min(3).max(100); break;
                case "district":
                    validator[`${prop}`] = JOI.string().required().min(2).max(100); break;
                case "state":
                    validator[`${prop}`] = JOI.string().required().min(2).max(100); break;
                case "country":
                    validator[`${prop}`] = JOI.string().required().min(2).max(100); break;
                case "zip_code":
                    validator[`${prop}`] = JOI.string().required().regex(/^[0-9]{6,6}$/); break;
                case "uuid":
                    validator[`${prop}`] = JOI.string(); break;
                case "is_active":
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