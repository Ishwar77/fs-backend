const express = require("express");
const router = express.Router();
const ApiResponse = require('../../models/apiResponse');
const MyConst = require('../utils');
const ExportDataModel = require('./export.model');
const Authorize = require('../middlewares/authorize');
const { Parser } = require('json2csv');
const fs = require('fs');
const UserModel = require('../user-module/user.model');
const BatchModel = require('../batch/batch.model');
const JoinModel = require('../join/join.model');

router.get('/getallsubscriptiondetails', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getAllRegistrationDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("AllSubscribedUsers.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to AllSubscribedUsers.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/getactivesubscriptiondetails', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getActiveRegistrationDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("ActiveSubscribedUsers.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to ActiveSubscribedUsers.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/expiredsubscriptiondetails', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getExpiredRegistrationDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("ExpiredSubscribedUsers.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to ExpiredSubscribedUsers.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/alluserdetails', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getAllUserDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("AllUsers.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to AllUsers.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/activeuserdetails', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getActiveUserDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("ActiveUsers.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to ActiveUsers.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/inactiveuserdetails', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getInActiveUserDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("InActiveUsers.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to InActiveUsers.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/batches', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getAllBatchesDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("AllBatches.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to AllBatches.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/onlyactivebatches', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getActiveBatchesDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("ActiveBatches.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to ActiveBatches.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/thatarenotactivebatches', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getInActiveBatchesDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("InActiveBatches.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to InActiveBatches.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/coupons', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getAllCouponDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("Coupons.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to Coupons.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/existingactivecoupons', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getActiveCouponDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("ActiveCoupons.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to ActiveCoupons.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/expiredinactivecoupons', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getInActiveCouponDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("InActiveCoupons.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to InActiveCoupons.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/eventontrainerid/:instructor_id', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.instructor_id;
    const trainer = await UserModel.getUserByUUId(id);
    if(!trainer || !trainer.user_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await ExportDataModel.getEventsOnInstructorId(trainer.user_id);
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("EventsOnInstructorId.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to EventsOnInstructorId.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/attendeesbatchid/:batch_id/atendeeslistobdate/:date', Authorize.verifyJWT, async (req, res) => {
  try {
    const id = req.params.batch_id;
    const dateValue = req.params.date;
    const batch = await BatchModel.getBatchByUUID(id);
    if(!batch || !batch[0].batches_id){
        ApiResponse.sendResponse(res, 400, "Bad Input");
        return;
    }
    const rows = await JoinModel.listOfAtendees(batch[0].batches_id, dateValue);
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("AttendeesOnBatchandDate.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to AttendeesOnBatchandDate.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/events', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getAllEvents();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("Events.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to Events.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/existingevents', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getActiveEvents();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("ActiveEvents.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to ActiveEvents.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});


router.get('/exeventsexpired', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getInActiveEvents();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("InActiveEvents.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to InActiveEvents.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/allattendance', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await ExportDataModel.getAllAttendance();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("AllAttendance.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to AllAttendance.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});

router.get('/payment', Authorize.verifyJWT, async (req, res) => {
  try {
    const rows = await JoinModel.getAllPaymentDetails();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rows);
    // console.log(csv);
    fs.writeFile("AllPayments.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to AllPayments.csv successfully!");
    });
    ApiResponse.sendResponse(res, 200, "Success", rows);
  } catch (e) {
    console.log(e);
    ApiResponse.sendResponse(res, 400, "Failed", e);
  }
});
module.exports = router;