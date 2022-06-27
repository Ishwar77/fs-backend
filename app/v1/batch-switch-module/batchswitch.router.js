const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const BatchSwitchModel = require('./batchswitch.model');
const BatchSwitchUtil = require('./batchswitch.util');
const BatchRegistrationUtil = require('../event-registration-batches/event-reg-batch.util');
const BatchReistrationModel = require('../event-registration-batches/event-reg-batch.model');
const UserModel = require('../user-module/user.model');
const BatchModel = require('../batch/batch.model');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');
const Helper = require('../../utils/helper');
const EmailUtils = require('../../utils/emailUtils');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const batchswitchmodels = await BatchSwitchModel.getBatchSwitch(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Batch Switch", batchswitchmodels);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const batchswitchId = parseInt(req.params.id) || 0;
    const batchswitchmodels = await BatchSwitchModel.getBatchSwitchById(batchswitchId)
    ApiResponse.sendResponse(res, 200, "Getting all Batch Switch by ID", batchswitchmodels);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    const err = BatchSwitchUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const batchswitchmodels = await BatchSwitchModel.createBatchSwitchRequest(req.body);
    ApiResponse.sendResponse(res, batchswitchmodels ? 200 : 400, batchswitchmodels ? "Creation Success" : "Creation Failed", batchswitchmodels);
    const user = await UserModel.getUserById(req.body.user_id);
    await Helper.sendEMail(user.email_id, "Batch Changing request Sent", null,
                "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hello "+user.diaplay_name+" ,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b></b>Your request for Changing the Batch timings has been successfully sent to the Trainer. </p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>You will be notified Once the Trainer Approves it.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries you can contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>",
                EmailUtils.getFromAddress());
    const trainer = await BatchModel.emailAddressOfTrainer(req.body.batch_id);
        await Helper.sendEMail(trainer[0].email_id, "Batch Change Request", null,
                "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hello "+trainer[0].diaplay_name+" ,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b></b>User <b>"+user.diaplay_name+"</b> has requested you to change the Batch to BatchID <b>"+trainer[0].batches_id+"</b> for the Event <b> "+trainer[0].event_name+" </b>. </p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Please do the needful by logging into the Application.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries you can contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>",
                EmailUtils.getFromAddress());
});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const batchswitchId = parseInt(req.params.id) || 0;
    if (!batchswitchId) {
        const msg = "Batch Switch: PUT Id = " + batchswitchId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Batch Switch Id seems invalid", msg);
        return;
    }
    const err = BatchSwitchUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const batchswitchmodels = await BatchSwitchModel.updateBatchSwitchById(batchswitchId, req.body);
    ApiResponse.sendResponse(res, batchswitchmodels ? 200 : 400, batchswitchmodels ?"Update Success" : "Update Failed", {status: batchswitchmodels });
});


router.put('/updatingontrainerapproval/:id', Authorize.verifyJWT, async (req, res) => {
    const batchregId = parseInt(req.params.id) || 0;
    if (!batchregId) {
        const msg = "Batch Registration: PUT Id = " + batchregId + ", is invalid, body  " + JSON.stringify(req.body);
        ApiResponse.sendResponse(res, 400, "Batch Registration Id seems invalid", msg);
        return;
    }
    const err = BatchRegistrationUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const batchregmodels = await BatchReistrationModel.updateRegisteredBatchById(batchregId, req.body);
    // console.log("batchregmodels = ", batchregmodels);
    if(!batchregmodels) {
        logger.error("Unable to update the Batch Registration ")
        logger.info(JSON.stringify(req.body) );
        ApiResponse.sendResponse(res, 400, "Failed to update the Batch Registration");
        return;
    }
    const userEmail = await BatchSwitchModel.emailAddressOfUser(batchregId);
    const batchTime = await BatchModel.getBatchById(req.body.batch_id);
    // console.log(batchTime[0].start_time);
    // console.log("EMAIL ", userEmail);
    // console.log("BACHID ", req.body.batch_id);
    const softdeleterequest = await BatchSwitchModel.softDeleteRequest(batchregId);
            await Helper.sendEMail(userEmail[0].email_id, "Batch Change Request", null,
                "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hello "+userEmail[0].diaplay_name+" ,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b></b>Your request for changing the batch to the time <b> "+batchTime[0].start_time+" </b> for the event <b>"+userEmail[0].event_name+"</b> has been Approved by the Trainer</b>. </p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>Login to the Application and Enjoy your Sessions.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries you can contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>",
                EmailUtils.getFromAddress());

    ApiResponse.sendResponse(res, batchregmodels ? 200 : 400, batchregmodels ?"Update Success" : "Update Failed", {status: batchregmodels });
    // const softdeleterequest = await BatchSwitchModel.softDeleteRequest(batchregId);
});


router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const batchswitchId = parseInt(req.params.id) || 0;
    if (!batchswitchId) {
        const msg = "Batch Switch: PUT Id = " + batchswitchId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Batch Switch Id seems invalid", msg);
        return;
    } 
   const batchswitchmodels = await BatchSwitchModel.deleteBatchSwitchById(batchswitchId);
    ApiResponse.sendResponse(res, batchswitchmodels === 1 ? 200 : 400, batchswitchmodels  === 1 ?"Delete Success" : "Deletion Failed", {status: batchswitchmodels });
});

router.get('/trainer/:instructor_id', Authorize.verifyJWT, async (req, res) => {
    const id = req.params.instructor_id;
    const user = await UserModel.getUserByUUId(id);
    if(!user || !user.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const batchswitchmodels = await BatchSwitchModel.getDataOnTrainerID(user.user_id)
    ApiResponse.sendResponse(res, 200, "Getting Batch Switch Requests", batchswitchmodels);
});

router.get('/reject/user/:user_id/batch/:batch_id/regbatch/:reg_batch_id', Authorize.verifyJWT, async (req, res) => {
    const userId = parseInt(req.params.user_id) || 0;
    const batchId = parseInt(req.params.batch_id) || 0;
    const batchregId = parseInt(req.params.reg_batch_id) || 0;
    const batchswitchmodels = await BatchSwitchModel.rejectTheRequest(userId, batchId, batchregId)
    ApiResponse.sendResponse(res, 200, "Request Rejected Successfully", batchswitchmodels);
    const userEmail = await UserModel.getUserById(userId);
    // console.log("EMAIL ", userEmail.email_id);
                await Helper.sendEMail(userEmail.email_id, "Batch Change Request Rejected", null,
                "<p style='line-height: 1.6;font-size: 1.2rem;font-weight: 700;'> Hello "+userEmail.diaplay_name+" ,</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'><b></b>Your batch change request has been Rejected by the Trainer</b>. </p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For more information please contact the respective Trainer.</p><p style='line-height: 1.6;font-size: 0.95rem;text-align: justify;'>For further queries contact our team.</p><br> Contact:<span style='color:#000;font-size: 14px;font-weight: 500;'>+91 789 289 1430</span><p style='line-height: 1.6;font-size: 0.95rem;'><b>Thank you,</b><br><b><i>The Fit Socials Team</i></b><br><a href = 'mailto:Thefitsocials@gmail.com' target = '_blank'>Thefitsocials@gmail.com</a><br></p></div></div></div><div style='width: 100%;display: block;align-items: center;justify-content: center;margin-top: 10px;'><div style='text-align: center; line-height: 1rem; width: 100%; border: 1px solid #f4f4f4;padding: 20px;'><p style='color:silver;font-size: 0.5rem;'><span style='font-weight: 600;font-size: 0.7rem;'>This is an automatically generated email.</span><br><span>Replies to this email box will be monitored, Phone calls shall have the first preference the email responsesmay take minimum of 2 working days.</span><br><span>Contact number: +91 789 289 1430</span> <br><span>This email was sent to you because you created an account with The Fit Socials.</span> </p></div></div>",
                EmailUtils.getFromAddress());
});

//UUID operations
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const batchswitchmodels = await BatchSwitchModel.getBatchSwitchByUUId(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Batch Switch Requests", batchswitchmodels);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = BatchSwitchUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const batchswitchmodels = await BatchSwitchModel.updateBatchSwitchByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, batchswitchmodels ? 200 : 400, batchswitchmodels ? "Update Success" : "Update Failed", { status: batchswitchmodels });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const batchswitchmodels = await BatchSwitchModel.deleteBatchSwitchByUUId(req.params.id);
    ApiResponse.sendResponse(res, batchswitchmodels === 1 ? 200 : 400, batchswitchmodels === 1 ? "Delete Success" : "Deletion Failed", { status: batchswitchmodels });
});

module.exports = router;