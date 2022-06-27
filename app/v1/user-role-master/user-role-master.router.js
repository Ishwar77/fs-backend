const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const SubscriptionModel = require('./user-role-master.model');
const UserRoleMasterUtil = require('./user-role-master.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const eventmodels = await SubscriptionModel.getUserRoleMaster(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all UserRoleMasters", eventmodels);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    const eventmasters = await SubscriptionModel.getUserRoleMasterById(eventmasterId)
    ApiResponse.sendResponse(res, 200, "Getting UserRoleMaster ", eventmasters);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    
    const err = UserRoleMasterUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const eventmasters = await SubscriptionModel.createUserRoleMaster(req.body);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ? "Creation Success" : "Creation Failed", eventmasters);

});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    if (!eventmasterId) {
        const msg = "UserRoleMaster: PUT Id = " + eventmasterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "UserRoleMaster Id seems invalid", msg);
        return;
    }

    const err = UserRoleMasterUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   //console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

   const eventmasters = await SubscriptionModel.updateUserRoleMasterById(eventmasterId, req.body);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ?"Update Success" : "Update Failed", {status: eventmasters });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    if (!eventmasterId) {
        const msg = "SubscriptionModel: Delete Id = " + eventmasterId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "SubscriptionModel Id seems invalid", msg);
        return;
    } 
   const eventmasters = await SubscriptionModel.deleteUserRoleMasterById(eventmasterId);
   // console.log(eventmasters);
    ApiResponse.sendResponse(res, eventmasters === 1 ? 200 : 400, eventmasters  === 1 ?"Delete Success" : "Deletion Failed", {status: eventmasters });
});



//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasters = await SubscriptionModel.getUserRoleMasterByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting eventmasters", eventmasters);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = UserRoleMasterUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const eventmasters = await SubscriptionModel.updateUserRoleMasterByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, eventmasters ? "Update Success" : "Update Failed", { status: eventmasters });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const eventmasters = await SubscriptionModel.deleteUserRoleMasterByUUId(req.params.id);
    ApiResponse.sendResponse(res, eventmasters === 1 ? 200 : 400, eventmasters === 1 ? "Delete Success" : "Deletion Failed", { status: eventmasters });
});
module.exports = router;