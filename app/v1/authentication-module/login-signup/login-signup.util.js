const MyConst = require('../../utils');
const JOI = require('@hapi/joi');

module.exports = class LoginSignupUtility {

    static hasError(model, action = MyConst.AuthActions.LOGIN) {
        if (!model) {
            return { error: "Data Missing" };
        }

        const keys = Object.getOwnPropertyNames(model);
        if (!keys || !keys.length) {
            return { error: "Data Missing" };
        }

        const error = LoginSignupUtility.getJoiVerificationModel(action, model).validate(model);
        // console.log('Err =', error);
        return (error && error.error) ? error.error : null;
    }


    /**
     * Request data sent by user will be in plain format
     */
    static getJoiVerificationModel(action = MyConst.AuthActions.LOGIN) {
        if (action === MyConst.AuthActions.LOGIN) {
            return JOI.object({
                email: JOI.string().email().max(100).required(),
                password: JOI.string().min(5).max(60).required()
            });
        } else if (action === MyConst.AuthActions.SIGNUP) {
            return JOI.object({
                name: JOI.string().min(3).max(100).required(),
                dob: JOI.date(),
                gender: JOI.string().min(1).max(10).required().default('N/A'),
                email: JOI.string().email().max(100).required(),
                mobile: JOI.string().min(5).max(30).required(),
                userRoleId: JOI.number().min(1).required(),
                password: JOI.string().min(5).required(),
                repeat_password: JOI.ref('password'),
                referral_code: JOI.string(),
                uuid: JOI.string(),
                isActive: JOI.number(),
                expertise_in: JOI.string(),
                experience: JOI.number(),
                location: JOI.string()
            });
        } else {
            /* return JOI.object({
                token: JOI.string().min(1).max(100),
                email: JOI.string().email().max(100),
                password: JOI.string().min(5).max(60),
                repeat_password: JOI.ref('password')
            }); */
        }
    }
}