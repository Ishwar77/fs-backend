const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const PointRedemptionModel = require('./points-redemption.model');
const PointRedemptionUtil = require('./points-redemption.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const UserModel = require('../user-module/user.model');
const Helper = require('../../utils/helper');
const EmailUtils = require('../../utils/emailUtils');


router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = PointRedemptionUtil.getJoiValidatecreate(req.body)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const pointredemmodel = await PointRedemptionModel.createPointRedemption(req.body);
    ApiResponse.sendResponse(res, pointredemmodel ? 200 : 400, pointredemmodel ? "Creation Success" : "Creation Failed", pointredemmodel);
    if (pointredemmodel) {
        var matchingtrainers = await UserModel.getUserById(req.body.trainerId);
        if (!matchingtrainers) {
            return;
        }
        await Helper.sendEMail(matchingtrainers.email_id, "Point Redumption request", null,
            "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hello " + matchingtrainers.diaplay_name + " ,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b></b>The user Requested the point redumption for your event</b>. </p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For more information please login to the application.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>",
            EmailUtils.getFromAddress());
    }
});

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const pointredemmodel = await PointRedemptionModel.getPointredemption(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Points", pointredemmodel);
});

router.get('/user/:id', Authorize.verifyJWT, async (req, res) => {
    const pointredemId = parseInt(req.params.id) || 0;
    const pointredemmodel = await PointRedemptionModel.getbyredemptionbyuserId(pointredemId)
    ApiResponse.sendResponse(res, 200, "Getting all points based on user ID", pointredemmodel);
});

router.get('/trainer/:id', Authorize.verifyJWT, async (req, res) => {
    const pointredemId = parseInt(req.params.id) || 0;
    const pointredemmodel = await PointRedemptionModel.getbyredemptionbytrainerId(pointredemId)
    ApiResponse.sendResponse(res, 200, "Getting all points based on trainer ID", pointredemmodel);
});

router.get('/event/:id', Authorize.verifyJWT, async (req, res) => {
    const pointredemId = parseInt(req.params.id) || 0;
    const pointredemmodel = await PointRedemptionModel.getbyredemptionbyeventId(pointredemId)
    ApiResponse.sendResponse(res, 200, "Getting all points based on Event ID", pointredemmodel);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const pointredemId = parseInt(req.params.id) || 0;
    const pointredemmodel = await PointRedemptionModel.getbyredemptionbyId(pointredemId)
    ApiResponse.sendResponse(res, 200, "Getting all points based on ID", pointredemmodel);
});

router.put('/:id', async (req, res) => {
    const pointredemId = parseInt(req.params.id) || 0;
    if (!pointredemId) {
        const msg = "Point redemption: PUT Id = " + pointredemId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Point redemption Id seems invalid", msg);
        return;
    }
    const err = PointRedemptionUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const pointredemmodel = await PointRedemptionModel.updateredemptionById(pointredemId, req.body);
    ApiResponse.sendResponse(res, pointredemmodel ? 200 : 400, pointredemmodel ? "Update Success" : "Update Failed", { status: pointredemmodel });
});

router.put('/reject/:id', async (req, res) => {
    const pointredemId = parseInt(req.params.id) || 0;
    if (!pointredemId) {
        const msg = "Point redemption: PUT Id = " + pointredemId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Point redemption Id seems invalid", msg);
        return;
    }
    const pointredemmodel = await PointRedemptionModel.rejectredemptionById(pointredemId);
    ApiResponse.sendResponse(res, pointredemmodel ? 200 : 400, pointredemmodel ? "Update Success" : "Update Failed", { status: pointredemmodel });
    if (pointredemmodel) {
        var matchingtrainers = await UserModel.getUserById(req.body.trainerId);
        if (!matchingtrainers) {
            return;
        }
        console.log(100);
        await Helper.sendEMail(matchingtrainers.email_id, "Point Redumption request", null,
            "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hello " + matchingtrainers.diaplay_name + " ,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b></b>The trainer rejected the point reduction, requested by you</b>. </p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For more information please login to the application.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>",
            EmailUtils.getFromAddress());
    }
});

router.delete('/:id', async (req, res) => {
    const pointredemId = parseInt(req.params.id) || 0;
    if (!pointredemId) {
        const msg = "Points redemption: PUT Id = " + pointredemId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Points redemption Id seems invalid", msg);
        return;
    }
    const pointredemmodel = await PointRedemptionModel.deleteredemptionById(pointredemId);
    ApiResponse.sendResponse(res, pointredemmodel === 1 ? 200 : 400, pointredemmodel === 1 ? "Delete Success" : "Deletion Failed", { status: pointredemmodel });
});
module.exports = router;