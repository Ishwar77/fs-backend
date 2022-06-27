const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class InvoiceUtil {

    /**
     * Utility method to validate the Object
     * @param model InvoiceModel 
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
        const error = InvoiceUtil.getJoiVerificationModel(action, model).validate(model);
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
            id: JOI.number(),
            invoice_number: JOI.string(),
            user_email_id: JOI.string(),
            invoice_data: JOI.object(),
            notes: JOI.object(),
            details: JOI.object(),
            invoice_status: JOI.string(),
            created_at: JOI.date().default(new Date()),
            updated_at: JOI.date().default(new Date())
        });
    } else {
        return JOI.object(InvoiceUtil.generateDynamicUpdateValidator(reqBody));
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
                validator[`${prop}`] = JOI.number(); break;
            case "invoice_number": 
                validator[`${prop}`] = JOI.string(); break;
            case "user_email_id":
                validator[`${prop}`] = JOI.string(); break;
            case "invoice_data":
                validator[`${prop}`] = JOI.object(); break;
            case "notes":
                validator[`${prop}`] = JOI.object(); break;
            case "details":
                validator[`${prop}`] = JOI.object(); break;
            case"invoice_status":
                validator[`${prop}`] = JOI.string(); break;
            case "created_at":
                validator[`${prop}`] = JOI.date(); break;
            case "updated_at":
                validator[`${prop}`] = JOI.date(); break;
        }
    });
    return validator;
}
}