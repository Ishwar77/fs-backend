const MyConst = require('../utils');
const JOI = require('@hapi/joi');
const CouponModel = require('./coupon.model');

module.exports = class CouponUtil {



    /**
     * Utility method to validate the Object
     * @param model GalleryModel 
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

        const error = CouponUtil.getJoiVerificationModel(action, model).validate(model);
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
                event_id: JOI.number().required().min(1),
                title: JOI.string().required().min(2).max(50),
                description: JOI.string().max(500),
                image_url: JOI.string().max(200),
                discount_percent: JOI.number().required(),
                max_discount_amount: JOI.number().required(),
                usage_count: JOI.number().default(0),
                max_usage_count: JOI.number().required().default(0),
                expiry: JOI.date().default(new Date()).required(),
                uuid: JOI.string(),
                created_at: JOI.date().default(new Date()),
                updated_at: JOI.date().default(new Date()),
                isActive: JOI.number().default(1),
                isPrivate: JOI.number().default(0)
            });
        } else {
            return JOI.object(CouponUtil.generateDynamicUpdateValidator(reqBody));
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
                case "title":
                    validator[`${prop}`] = JOI.string().required().min(2).max(50); break;
                case "description":
                    validator[`${prop}`] = JOI.string().max(500); break;
                case "image_url":
                    validator[`${prop}`] = JOI.string().max(200); break;
                case "discount_percent":
                    validator[`${prop}`] = JOI.number().required(); break;
                case "max_discount_amount":
                    validator[`${prop}`] = JOI.number().required(); break;
                case "usage_count":
                    validator[`${prop}`] = JOI.number().default(0); break;
                case "max_usage_count":
                    validator[`${prop}`] = JOI.number().required().default(0); break;
                case "expiry":
                    validator[`${prop}`] = JOI.date().default(new Date()).required(); break;
                case "uuid":
                    validator[`${prop}`] = JOI.string(); break;
                case "isActive":
                    validator[`${prop}`] = JOI.number(); break;
                case "isPrivate":
                        validator[`${prop}`] = JOI.number().default(0); break;
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