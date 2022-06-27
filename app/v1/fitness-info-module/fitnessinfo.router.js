const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const FitnessInfoModel = require('./fitnessinfo.model');
const FitnessInfoUtil = require('./fitnessinfo.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const UserModel = require('../user-module/user.model');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const fitnessinfos = await FitnessInfoModel.getFitnessInfo(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Fitness Info", fitnessinfos);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const fitnessinfoId = parseInt(req.params.id) || 0;
    const fitnessinfos = await FitnessInfoModel.getFitnessInfoById(fitnessinfoId)
    ApiResponse.sendResponse(res, 200, "Fitness Info", fitnessinfos);
});

router.get('/user/:id', Authorize.verifyJWT, async (req, res) => {
    const userUUId = req.params.id || null;
    const user = await UserModel.getUserByUUId(userUUId);
    // console.log("USER UUID", userUUId);
    // console.log("USER ", user.user_id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const fitnessinfos = await FitnessInfoModel.getFitnessInfoByUserId(user.user_id)
    ApiResponse.sendResponse(res, 200, "User Fitness Info", fitnessinfos);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    
    const err = FitnessInfoUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const fitnessinfos = await FitnessInfoModel.createFitnessInfo(req.body);
    ApiResponse.sendResponse(res, fitnessinfos ? 200 : 400, fitnessinfos ? "Creation Success" : "Creation Failed", fitnessinfos);

});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const fitnessinfoId = parseInt(req.params.id) || 0;
    if (!fitnessinfoId) {
        const msg = "Fitness Info: PUT Id = " + fitnessinfoId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Fitness Info Id seems invalid", msg);
        return;
    }

    const err = FitnessInfoUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   //console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

   const fitnessinfos = await FitnessInfoModel.updateFitnessInfoById(fitnessinfoId, req.body);
    ApiResponse.sendResponse(res, fitnessinfos ? 200 : 400, fitnessinfos ?"Update Success" : "Update Failed", {status: fitnessinfos });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const fitnessinfoId = parseInt(req.params.id) || 0;
    if (!fitnessinfoId) {
        const msg = "Fitness Info: PUT Id = " + fitnessinfoId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Fitness Info Id seems invalid", msg);
        return;
    } 
   const fitnessinfos = await FitnessInfoModel.deleteFitnessInfoById(fitnessinfoId);
    //console.log(fitnessinfos);
    ApiResponse.sendResponse(res, fitnessinfos === 1 ? 200 : 400, fitnessinfos  === 1 ?"Delete Success" : "Deletion Failed", {status: fitnessinfos });
});



//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const fitnessinfos = await FitnessInfoModel.getFitnessInfoByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting fitnessinfos", fitnessinfos);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = FitnessInfoUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const fitnessinfos = await FitnessInfoModel.updateFitnessInfoByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, fitnessinfos ? 200 : 400, fitnessinfos ? "Update Success" : "Update Failed", { status: fitnessinfos });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const fitnessinfos = await FitnessInfoModel.deleteFitnessInfoByUUId(req.params.id);
    ApiResponse.sendResponse(res, fitnessinfos === 1 ? 200 : 400, fitnessinfos === 1 ? "Delete Success" : "Deletion Failed", { status: fitnessinfos });
});
module.exports = router;