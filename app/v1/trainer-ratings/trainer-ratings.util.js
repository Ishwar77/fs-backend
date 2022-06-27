const MyConst = require('../utils');
const JOI = require('@hapi/joi');

module.exports = class TrainerratingUtil {

    /**
     * Utility method to validate the Object
     * @param model TrainerRatingModel 
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

        const error = TrainerratingUtil.getJoiVerificationModel(action, model).validate(model);
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
                user_id: JOI.number(),
                batch_id: JOI.number(),
                date: JOI.date(),
                isActive: JOI.number().default(1),
            });
        } else {
            return JOI.object(TrainerratingUtil.generateDynamicUpdateValidator(reqBody));
        }
    }

    static getJoiValidatecreate(model) {
        const obj = JOI.object({
            userId: JOI.number().required().min(1),
            trainerId: JOI.number().required().min(1),
            ratings: JOI.number().required().min(1).default(1)
        });

        const error = obj.validate(model);
        return (error && error.error) ? error.error : null;
    }

    static generateDynamicUpdateValidator(reqBody) {
        if (!reqBody) {
            return null;
        }

        const validator = {};
        const props = Object.getOwnPropertyNames(reqBody);
        props.forEach(prop => {
            switch (prop) {
                case "rating_id":
                    validator[`${prop}`] = JOI.number().required().min(1); break;
                case "user_id":
                    validator[`${prop}`] = JOI.number(); break;
                case "trainer_id":
                    validator[`${prop}`] = JOI.number(); break;
                case "ratings":
                    validator[`${prop}`] = JOI.number().min(1).default(1); break;
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
        return validator;
    }

}