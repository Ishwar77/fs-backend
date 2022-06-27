const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const AuthenticationModel = require('./authentication.model');
const MyConst = require('../utils');
const AuthenticationUtility = require('./authentication.util');
const reqIp = require("request-ip");
const LoginSignupModel = require('./login-signup/login-signup.model');
const LoginUtility = require('./login-signup/login-signup.util');
const UserModel = require("../user-module/user.model");
const Authorize = require('../middlewares/authorize');

router.get('/', async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const events = await AuthenticationModel.getAuthentication(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Auth data", events);
});


router.get('/:id', async (req, res) => {
    const eventId = parseInt(req.params.id) || 0;
    const events = await AuthenticationModel.getAuthenticationById(eventId)
    ApiResponse.sendResponse(res, 200, "Getting Auth info", events);
});

router.get('/user/:id', async (req, res) => {
    const userUUId = req.params.id || null;
    const user = await UserModel.getUserByUUId(userUUId);
    // console.log("USER UUID", userUUId);
    // console.log("USER ", user.user_id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const users = await AuthenticationModel.getAuthenticationByUserId(user.user_id)
    ApiResponse.sendResponse(res, 200, "Getting User's auth info", users);
});

router.post('/', async (req, res) => {

    const err = AuthenticationUtility.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
  
    const events = await AuthenticationModel.createAuthentication(req.body);
    // console.log(events);
    ApiResponse.sendResponse(res, events ? 200 : 400, events ? "Creation Success" : "Creation Failed", events);
});


router.put('/:id', async (req, res) => {
    const eventId = parseInt(req.params.id) || 0;

    if (!eventId) {
        const msg = "Authentication: PUT Id = " + eventId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Authentication Id seems invalid", msg);
        return;
    }

    const err = AuthenticationUtility.hasError(req.body, MyConst.ValidationModelFor.UPDATE)

    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

   const events = await AuthenticationModel.updateAuthenticationById(eventId, req.body);

   ApiResponse.sendResponse(res, events ? 200 : 400, events ? "Update Success" : "Update Failed", { status: events });
});

router.post('/update', Authorize.verifyJWT, async (req, res) => {
    const email = req.body['email'] || null;
    const newPassword = req.body['password'] || null;

    const err = email === null || newPassword === null ? true : false;
    if(err) {
        logger.error("Reset request cannot be processed");
        logger.error(JSON.stringify(req.body));
        ApiResponse.sendResponse(res, 400, "Password reset Failed due to bad Inputs", err);
        return;
    }

    const events = await AuthenticationModel.resetPassword(email, newPassword);
   // console.log(events);
    if(events && events.state === 'ERROR') {
        ApiResponse.sendResponse(res, 400, "Password Reset Failed", events);
    } else {
        ApiResponse.sendResponse(res, 200, "Password Reset Success", events);
    }
});

router.delete('/:id', async (req, res) => {
    const eventId = parseInt(req.params.id) || 0;

    if (!eventId) {
        const msg = "Authentication: Delete Id = " + eventId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Authentication Id seems invalid", msg);
        return;
    } 
   const events = await AuthenticationModel.deleteAuthenticationById(eventId);
    // console.log(events);
    ApiResponse.sendResponse(res, events === 1 ? 200 : 400, events  === 1 ?"Delete Success" : "Deletion Failed", {status: events });
});





////// Login and Sign up actions are managed here

router.post('/login', async (req, res) => {
    const ip = reqIp.getClientIp(req);
    const err = LoginUtility.hasError(req.body, MyConst.AuthActions.LOGIN)
    if(err) {
        logger.error("Login Failed");
        logger.error(JSON.stringify(req.body));
        ApiResponse.sendResponse(res, 400, "Login Failed due to bad Inputs", err);
        return;
    }

    const events = await LoginSignupModel.makeLogin(req.body, ip);
    // console.log(events);
    if(events && events.state === 'ERROR') {
        ApiResponse.sendResponse(res, 400, "Login Failed", events);
    } else {
        ApiResponse.sendResponse(res, 200, "Login Success", events);
    }
});

router.post('/signup', async (req, res) => {

    const err = LoginUtility.hasError(req.body, MyConst.AuthActions.SIGNUP);
    console.log('err = ', err);
    if(err) {
        logger.error("Signup Failed");
        logger.error(JSON.stringify(req.body));
        ApiResponse.sendResponse(res, 400, "Signup Failed due to bad Inputs", err);
        return;
    }

    const events = await LoginSignupModel.makeSignup(req.body);
    console.log(events);
    if(events && events.state === 'ERROR') {
        ApiResponse.sendResponse(res, 400, "Signup Failed", events);
    } else {
        ApiResponse.sendResponse(res, 200, "Signup Success", events);
    }
});

/**
 * Accepts the email address
 */
router.post('/forget', async (req, res) => {
    const email = req.body['email'] || null;

    if(!email) {
        logger.error("Login Failed, generate reset token");
        logger.error(JSON.stringify(req.body));
        ApiResponse.sendResponse(res, 400, "Failed to generate password reset token, due to bad Inputs");
        return;
    }

    const events = await LoginSignupModel.makeResetToken(email);
    console.log(events);
    if(events && events.state === 'ERROR') {
        ApiResponse.sendResponse(res, 400, "Reset token generation Failed", events);
    } else {
        ApiResponse.sendResponse(res, 200, "Reset token generation Success", events);
    }
});

/**
 * Accepts the token, email address and new password string
 */
router.post('/reset', async (req, res) => {
    const email = req.body['email'] || null;
    const newPassword = req.body['password'] || null;
    const token = req.body['token'] || null;

    const err = email === null || newPassword === null ? true : false;
    if(err) {
        logger.error("Reset request cannot be processed");
        logger.error(JSON.stringify(req.body));
        ApiResponse.sendResponse(res, 400, "Password reset Failed due to bad Inputs", err);
        return;
    }

    const events = await LoginSignupModel.makeReset(email, newPassword, token);
   // console.log(events);
    if(events && events.state === 'ERROR') {
        ApiResponse.sendResponse(res, 400, "Password Reset Failed", events);
    } else {
        ApiResponse.sendResponse(res, 200, "Password Reset Success", events);
    }
});



router.post('/init-session', async (req, res) => {
    const ip = reqIp.getClientIp(req);
    const clientSignature = req.body['clientSignature'] || {};
    const userRole = req.body['userRole'] || 2;
    const userId = req.body['userId'] || -1;
    const isGuest = req.body['isGuest'] || true;
    clientSignature['IP'] = clientSignature['IP'] ? clientSignature['IP'] : ip;

    const events = await LoginSignupModel.initSession(userId, userRole, isGuest, clientSignature);
   // console.log(events);
    if(events && events.state === 'ERROR') {
        ApiResponse.sendResponse(res, 400, "Creating User Session Failed", events);
    } else {
        ApiResponse.sendResponse(res, 200, "Creating User Session Success", events);
    }
});



router.post('/trainer-signup', async (req, res) => {

    if(!req.body || !req.body.user || !req.body.payment) {
        logger.error("Trainer Signup Failed");
        logger.error(JSON.stringify(req.body));
        ApiResponse.sendResponse(res, 400, "Signup Failed due to bad Inputs", err);
        return;
    }
    const events = await LoginSignupModel.makePaymentAndSignUp(req.body);
    console.log(events);

    if(events && events.state === 'ERROR') {
        ApiResponse.sendResponse(res, 400, "Signup Failed", events);
    } else {
        ApiResponse.sendResponse(res, 200, "Signup Success", events);
    }
});
module.exports = router;