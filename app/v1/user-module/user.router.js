const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const UserModel = require('./user.model');
const UserUtil = require('./user.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const UserRoleModel = require('../user-role-master/user-role-master.model');

router.get('/', [Authorize.verifyJWT, Authorize.verifyJWT], async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const eventmodels = await UserModel.getUser(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Users", eventmodels);
});

router.get('/inactive', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const eventmodels = await UserModel.getInactiveUser(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Users", eventmodels);
});

router.get('/blocked/:id', Authorize.verifyJWT, async (req, res) => {
    const userRoleUUId = req.params.id || null;
    const userRole = await UserRoleModel.getUserRoleMasterByUUId(userRoleUUId);
    // console.log("USER UUID", userRoleUUId);
    // console.log("USER ", userRole);
    if (!userRole || !userRole.length || !userRole[0].user_role_id) {
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const eventmasters = await UserModel.getBlockedInstructor(userRole[0].user_role_id)
    ApiResponse.sendResponse(res, 200, "Getting User", eventmasters);
});

router.get('/all/:id', Authorize.verifyJWT, async (req, res) => {
    const userRoleUUId = req.params.id || null;
    const userRole = await UserRoleModel.getUserRoleMasterByUUId(userRoleUUId);
    // console.log("USER UUID", userRoleUUId);
    // console.log("USER ", userRole);
    if (!userRole || !userRole.length || !userRole[0].user_role_id) {
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const eventmasters = await UserModel.getInstructor(userRole[0].user_role_id)
    ApiResponse.sendResponse(res, 200, "Getting User", eventmasters);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    const eventmasters = await UserModel.getUserById(eventmasterId)
    // console.log("GET DETAILS");
    ApiResponse.sendResponse(res, 200, "Getting User", eventmasters);
});

router.get('/checkingemail/:email', Authorize.verifyJWT, async (req, res) => {
    const eventmasters = await UserModel.getUserByEmailAddress(req.params.email);
    if (eventmasters != null) {
       // console.log("Email Already Exists");
        ApiResponse.sendResponse(res, 200, "Email Already Exists", eventmasters);
        return 1;
    } else {
     //   console.log("Email Address does not Exists");
        ApiResponse.sendResponse(res, 400, "Email Does not exist")
        return 0;
    }
});

router.get('/page-name/:pageName', /* Authorize.verifyJWT, */ async (req, res) => {
    const trainerPageName = req.params.pageName || null;
    if (!trainerPageName || !trainerPageName.length) {
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const eventmasters = await UserModel.getUserByPageName(trainerPageName)
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ? "Trainer info, by page name" : "BAD INPUTS", eventmasters);
});

// TODO
// This service can be restricted to Roles Trainer and Above
router.post('/onboard/:trainerId', Authorize.verifyJWT, async (req, res) => {
    const trainerId = parseInt(req.params.trainerId) || 0;
    const file = req.files.file || null

    if (!trainerId || !file || !file.data || file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const msg = "Onboarding failed due to Bad Inputs";
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, msg);
        return;
    }

    const eventmasters = await UserModel.onboardClients(res, trainerId, file);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {

    const err = UserUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const eventmasters = await UserModel.createUser(req.body);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ? "Creation Success" : "Creation Failed", eventmasters);
});


router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    if (!eventmasterId) {
        const msg = "User: PUT Id = " + eventmasterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "User Id seems invalid", msg);
        return;
    }

    const err = UserUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    //  console.log('Ctrl, Error = ', err);
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const eventmasters = await UserModel.updateUserById(eventmasterId, req.body);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ? "Update Success" : "Update Failed", { status: eventmasters });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    if (!eventmasterId) {
        const msg = "UserModel: Delete Id = " + eventmasterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "UserModel Id seems invalid", msg);
        return;
    }
    const eventmasters = await UserModel.deleteUserById(eventmasterId);
    // console.log(eventmasters);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ? "Delete Success" : "Deletion Failed", { status: eventmasters });
});

//Operations on UUID
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const users = await UserModel.getUserByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting User", users);
});
module.exports = router;
