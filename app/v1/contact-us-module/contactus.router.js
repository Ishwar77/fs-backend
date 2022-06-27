const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const ContactUsModel = require('./contactus.model');
const ContactUsUtil = require('./contactus.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', [Authorize.verifyJWT, Authorize.adminOnly], async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const contactus = await ContactUsModel.getContactUs(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Contact Us Details", contactus);
});

router.get('/:id', [Authorize.verifyJWT, Authorize.adminOnly], async (req, res) => {
    const ContactUsId = parseInt(req.params.id) || 0;
    const ContactUss = await ContactUsModel.getContactUsById(ContactUsId)
    ApiResponse.sendResponse(res, 200, "Getting all Contact Us", ContactUss);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    
    const err = ContactUsUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const ContactUss = await ContactUsModel.createContactUs(req.body);
    ApiResponse.sendResponse(res, ContactUss ? 200 : 400, ContactUss ? "Creation Success" : "Creation Failed", ContactUss);

});

router.put('/:id', [Authorize.verifyJWT, Authorize.adminOnly], async (req, res) => {
    const ContactUsId = parseInt(req.params.id) || 0;
    if (!ContactUsId) {
        const msg = "Contact Us: PUT Id = " + ContactUsId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Contact Us Id seems invalid", msg);
        return;
    }

    const err = ContactUsUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
  // console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

   const ContactUss = await ContactUsModel.updateContactUsById(ContactUsId, req.body);
    ApiResponse.sendResponse(res, ContactUss ? 200 : 400, ContactUss ?"Update Success" : "Update Failed", {status: ContactUss });
});

router.delete('/:id', [Authorize.verifyJWT, Authorize.adminOnly], async (req, res) => {
    const ContactUsId = parseInt(req.params.id) || 0;
    if (!ContactUsId) {
        const msg = "Contact Us: PUT Id = " + ContactUsId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Contact Us Id seems invalid", msg);
        return;
    } 
   const ContactUss = await ContactUsModel.deleteContactUsById(ContactUsId);
   // console.log(ContactUss);
    ApiResponse.sendResponse(res, ContactUss === 1 ? 200 : 400, ContactUss  === 1 ?"Delete Success" : "Deletion Failed", {status: ContactUss });
});
module.exports = router;