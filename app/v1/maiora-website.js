const express = require("express");
const router = express.Router();
const logger = require('../utils/logger');
const ApiResponse = require('../models/apiResponse');
const Helper = require('../utils/helper');


/*
{"fullName":"roy","email":"roy.monteiro@maiora.co","mobile":"8970667663","subject":"Product Enquiry","message":"Need to product ","agree":true}

*/

const senders = {
    "maiora": "roy.monteiro@maiora.co",
    "test": "nandini.a@maiora.co"
};

router.post('/', async (req, res) => {
   // console.log(req.body);
  //  console.log(req.query.domain);
    try {
        const domain = req.query.domain;
        if (!domain || !senders[domain]) {
            ApiResponse.sendResponse(res, 400, "Unknown Sender");
            return false;
        }

        if (!req.body.message || !req.body.message.length) {
            ApiResponse.sendResponse(res, 400, "No Message to send");
            return false;
        }

        logger.info("Sending Email on behalf of " + domain);
        logger.info("Email Body = " + JSON.stringify(req.body));

        const body = `<p>Sender Name : ${req.body.fullName}</p>
        <p>Mobile : ${req.body.mobile || 'n/a'}</p>
        <p>Email : ${req.body.email || 'n/a'}</p>
        <p>${req.body.message}</p>` ;

        const x = await Helper.sendEMail(
            senders[domain], req.body.subject || "Enquery, from Maiora Website",
            body, body);

        ApiResponse.sendResponse(res, 200, "Success");
        return;
    } catch (e) {
        logger.error(e)
        logger.info("Failed to send email = " + JSON.stringify(req.body));
        ApiResponse.sendResponse(res, 400, "Failed");
    }

});

module.exports = router;