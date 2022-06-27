const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const FileUploadInputs = require('./files-module.util');
const paths = require('../../../paths');
var path = require('path');
const uploadDir = paths.uploads;

const UserModel = require('../user-module/user.model');
const CouponModel = require('../coupon-module/coupon.model');
const EventModel = require('../events-module/event.model');
const AdvertisementModel = require('../advertisement-module/advertisement.model');



router.get('/', async (req, res) => {
    ApiResponse.sendResponse(res, 200, "GET is not supported");
});

/**
 * Expects the following params in POST request body
 *  picture -> An Image file
 *  type -> 'USER' | 'EVENT' | 'COUPON'
 *  key -> ID: number
 */
router.post('/', async (req, res) => {

    const data = FileUploadInputs.getDataFromRequest(req.body);

   // console.log('File Data = ', data);
    if (FileUploadInputs.hasError(data)) {
        ApiResponse.sendResponse(res, 400, "BAD or MISSING inputs");
        return;
    }

    if (!req.files || !Object.keys(req.files).length) {
        ApiResponse.sendResponse(res, 400, "File Seems missing");
        return;
    }

  //  console.log('Meta Data = ', data);
 //   console.log('File = ', req.files);


    const tmpFile = req.files.picture;
    if (!tmpFile) {
        ApiResponse.sendResponse(res, 400, "Unable to get the file ");
        return;
    }

    let dir = uploadDir + path.sep;
    let remotePath = `http://${req.headers.host}/uploads/`;

    let subDir = ''
    switch (data.entityType.toLowerCase()) {
        case 'user': subDir += `users`; break;
        case 'event': subDir += `events`; break;
        case 'coupon': subDir += `coupons`; break;
        case 'advertise': subDir += `advertisements`; break;
        default: subDir += `others`; break;
    }

    remotePath += (subDir + '/');
    dir += (path.sep + subDir);

    dir += (path.sep + data.entityId + path.sep + tmpFile.name); // Append file name, with extension
    remotePath += `${data.entityId}/${tmpFile.name}`;

  // console.log('Dir = ', dir);
  // console.log('remotePath = ', remotePath);

    try {
        tmpFile.mv(dir).then(result => {
            manageFileMovement(res, remotePath, data);
        });
    } catch (e) {
        ApiResponse.sendResponse(res, 500, "Upload Failed", { error: e });
    }
});


const manageFileMovement = async (responseObj, remotePath, fileInputModel) => {
    if (!fileInputModel || !remotePath) {
        return null;
    }
    let response = null;
    // 1. Update DB
    try {

        switch (fileInputModel.entityType.toLowerCase()) {
            case 'user': // Update UserById
                response = await UserModel.updateUserById(fileInputModel.entityId, {
                    profile_picture_url: remotePath
                });
             //   console.log('Response = ', response);
                ApiResponse.sendResponse(responseObj, 200, "Upload Success", response);
                break;

            case 'coupon': // Update Coupon by Id
                response = await CouponModel.updatCouponById(fileInputModel.entityId, {
                    image_url: remotePath
                });
                ApiResponse.sendResponse(responseObj, 200, "Upload Success", response);
                break;

            case 'event': // Update Event by Id
                response = await EventModel.updateEventById(fileInputModel.entityId, {
                    cover_image: remotePath
                });
                ApiResponse.sendResponse(responseObj, 200, "Upload Success", response);
                break;

            case 'advertise': // Update advertise by Id
                response = await AdvertisementModel.updateAdvertisementById(fileInputModel.entityId, {
                    advertisement_image: remotePath
                });
                ApiResponse.sendResponse(responseObj, 200, "Upload Success", response);
                break;
        }
    } catch (e) {
    //    console.log('e = ', e);
        ApiResponse.sendResponse(responseObj, 500, "Unable to update pic", e);
        return false;
    }
}



module.exports = router;
