const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const CalendarModel = require('./calendar.model');

module.exports = class CalendarUtil {

    static getObjectFromRequest(reqBody) {
        if (!reqBody) {
            return null;
        }
        return new CalendarModel(reqBody["event_id"] || 0, reqBody["created_at"] || null, reqBody["isActive"] || 1, reqBody["updated_at"] || null);
    }

        /**
     * Utility method to validate the Object
     * @param model CalendarModel 
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

        const error = CalendarUtil.getJoiVerificationModel(action, model).validate(model);
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
                event_id: JOI.number().required()
            });
        } else {
           return JOI.object( CalendarUtil.generateDynamicUpdateValidator(reqBody) );
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
                case "event_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
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