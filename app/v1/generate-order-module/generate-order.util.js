const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const GenerateOrderModel = require('./generate-order.model');

module.exports = class GenerateOrderUtil {

    /**
     * Utility method to validate the Object
     * @param model GenerateOrderModel 
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
        const error = GenerateOrderUtil.getJoiVerificationModel(action, model).validate(model);
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
            order_gen_id: JOI.number(),
            amount: JOI.number(),
            reciptId: JOI.string(),
            notes: JOI.required(),
            created_at: JOI.date().default(new Date())
        });
    } else {
        return JOI.object(GenerateOrderUtil.generateDynamicUpdateValidator(reqBody));
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
            case "order_gen_id":
                validator[`${prop}`] = JOI.number(); break;
            case "amount":
                validator[`${prop}`] = JOI.number(); break;
            case "reciptId":
                validator[`${prop}`] = JOI.string(); break;
            case "notes":
                validator[`${prop}`] = JOI; break;
            case "created_at":
                validator[`${prop}`] = JOI.date(); break;
        }
    });
    return validator;
}
}