const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class AdvertisementUtil {

    /**
 * Utility method to validate the Object
 * @param model AdvertisementModel 
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
        const error = AdvertisementUtil.getJoiVerificationModel(action, model).validate(model);
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
            advertisement_id: JOI.number(), 
            advertisement_title: JOI.string(), 
            advertisement_description: JOI.string(), 
            advertisement_image: JOI.string(), 
            advertisement_start_date: JOI.date(), 
            advertisement_end_time: JOI.date(), 
            advertisement_spot: JOI.number(), 
            trainer_id: JOI.number(),
            amount_paid: JOI.number(),
            addvertising_days: JOI.number(),
            uuid: JOI.string(),
            created_at: JOI.date().default(new Date()),
            updated_at: JOI.date().default(new Date()),
            isActive: JOI.number().default(1),
        });
    } else {
        return JOI.object(AdvertisementUtil.generateDynamicUpdateValidator(reqBody));
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
            case "advertisement_id":
                validator[`${prop}`] = JOI.number().required().min(1); break;
            case "advertisement_title":
                validator[`${prop}`] = JOI.string(); break;
            case "advertisement_description":
                validator[`${prop}`] = JOI.string(); break;
            case "advertisement_image":
                validator[`${prop}`] = JOI.string(); break;
            case "advertisement_start_date":
                validator[`${prop}`] = JOI.date(); break;
            case "advertisement_end_time":
                validator[`${prop}`] = JOI.date(); break;
            case "trainer_id":
                validator[`${prop}`] = JOI.number(); break;
            case "amount_paid":
                validator[`${prop}`] = JOI.number(); break;
            case "addvertising_days":
                validator[`${prop}`] = JOI.number(); break;
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
    return validator;
}

}