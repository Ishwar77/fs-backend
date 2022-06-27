const express = require("express");
const router = express.Router();
const ApiResponse = require('../../models/apiResponse');
const UserPointsModel = require('./user-points.model');
const UserPointsUtil = require("./user-points.util");
const Authorize = require('../middlewares/authorize');
const UserModel = require("../user-module/user.model");
const PointredemptionModel = require('../points-redemption/points-redemption.model');
const Helper = require('../../utils/helper');
const EmailUtils = require('../../utils/emailUtils');

router.get('/', /*  Authorize.verifyJWT, */ async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const eventmodels = await UserPointsModel.getAll(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Users Reward Points", eventmodels);
});

/** To get all referrals made by a user */
router.get('/:id', /* Authorize.verifyJWT, */ async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    const eventmasters = await UserPointsModel.getByIds(eventmasterId)
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, "Reward Points info by Id", eventmasters);
});


/** To get all referrals made by a user */
router.get('/user/:id', /* Authorize.verifyJWT, */ async (req, res) => {
    const eventmasterId = parseInt(req.params.id) || 0;
    const isUUid = req.query.isuuid === 'true' ? true :
        typeof req.params.id === 'string' ? true : false;

    let userId = isUUid ? 0 : req.params.id;

    if (!userId) {
        const user = await UserModel.getUserByUUId(req.params.id);
        if (!user) {
            ApiResponse.sendResponse(res, 400, "No User exists, with given information");
            return;
        }
        userId = user['user_id'];
    }

    const eventmasters = await UserPointsModel.getByIds(userId, 'user_id');

    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, "Reward Points info of User", eventmasters);
});

/** To get all referrals made by a user */
router.get('/uuid/:uuid', /* Authorize.verifyJWT, */ async (req, res) => {
    const eventmasterId = req.params.uuid || null;
    const eventmasters = await UserPointsModel.getByIds(eventmasterId, 'uuid')
    ApiResponse.sendResponse(res, eventmasters ? 200 : 400, "Reward Points info by UUID", eventmasters);
});


router.post('/', /* Authorize.verifyJWT, */ async (req, res) => {
    const err = UserPointsUtil.hasError(req.body)
    if (err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const referral = await UserPointsModel.create(req.body);
    ApiResponse.sendResponse(res, referral ? 200 : 400, referral ? "Creation Success" : "Creation Failed", referral);
});

router.post('/creating', async (req, res) => {
    if (!req.body) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const pointactivechanges = {
        isActive: 0,
        status: "Accepted"
    }
    const points = await PointredemptionModel.updateredemptionById(req.body ? req.body.userId : '', pointactivechanges);
    if (!points) {
        ApiResponse.sendResponse(res, 400, "Cannot be updated");
        return;
    }
    const referral = await UserPointsModel.updateById(req.body ? req.body : '');
    ApiResponse.sendResponse(res, referral ? 200 : 400, referral ? "Success" : "Failed", { status: referral });
    if (referral && req.body && req.body.couponname && req.body.value) {
        var matchingtrainers = await UserModel.getUserById(req.body.userId);
        if (!matchingtrainers) {
            return;
        }
        await Helper.sendEMail(matchingtrainers.email_id, "Point Redumption request", null,
            "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hello " + matchingtrainers.diaplay_name + " ,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b></b>Your Point Redemption request has been accepted, please use " + req.body.couponname + " to get" + req.body.value + "% off</b>. </p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For more information please login to the application.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>",
            EmailUtils.getFromAddress());
    }
});

module.exports = router;