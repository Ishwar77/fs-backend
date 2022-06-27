const fs = require('fs');
const AWS = require('aws-sdk');
const express = require("express");
const process = require("process");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const FileUploadInputs = require('./s3Bucket.util');
const UserModel = require('../user-module/user.model');
const CouponModel = require('../coupon-module/coupon.model');
const EventModel = require('../events-module/event.model');
const AdvertisementModel = require('../advertisement-module/advertisement.model');
const requiredKeysandIds = require('../../../config/custom-environment-variables.json');


// const s3 = new AWS.S3({
//     accessKeyId: requiredKeysandIds.S3_BUCKET_ACCESS_KEY_ID_TEST,
//     secretAccessKey: requiredKeysandIds.S3_BUCKET_SECRET_ACCESS_KEY_TEST
// });

const s3 = new AWS.S3({
    accessKeyId: requiredKeysandIds.S3_BUCKET_ACCESS_KEY_ID_PROD,
    secretAccessKey: requiredKeysandIds.S3_BUCKET_SECRET_ACCESS_KEY_PROD
});

router.post('/users', async (req, res) => {
    const fileName = req.files ? req.files.picture : null;
    const requiredId = FileUploadInputs.getDataFromRequest(req.body);
    // console.log("DATA ", requiredId.entityId);
    if (!fileName) {
        ApiResponse.sendResponse(res, 400, "Unable to get the file ");
        return;
    }

    const folderBucketPathUsers = 'fit-socials-resources/' + process.env.NODE_ENV + '/users';
    // console.log("PATH ", folderBucketPath);

    const params = {
        // Bucket: 'test-fit-socials/users',
        // Bucket: 'fit-socials-resources/users',
        Bucket: folderBucketPathUsers,
        Key: (new Date().getTime()) + req.files.picture.name,
        Body: fileName.data,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };
    return s3.upload(params, function (s3Err, data) {
        if (s3Err) {
            logger.error("Failed to upload file into S3");
            throw s3Err
        }
        // console.log(`File uploaded successfully at ${data.Location}`)
        path = data.Location;
        response = UserModel.updateUserById(requiredId.entityId, {
        profile_picture_url: path
        });
        ApiResponse.sendResponse(res, 200, "Upload Success", path);
    });
});


router.post('/event', async (req, res) => {
    const fileName = req.files.picture;
    const requiredId = FileUploadInputs.getDataFromRequest(req.body);
    if (!fileName) {
        ApiResponse.sendResponse(res, 400, "Unable to get the file ");
        return;
    }
    const folderBucketPathEvents = 'fit-socials-resources/' + process.env.NODE_ENV + '/events';
    const params = {
        // Bucket: 'test-fit-socials/events',
        // Bucket: 'fit-socials-resources/events',
        Bucket: folderBucketPathEvents,
        Key: (new Date().getTime()) + req.files.picture.name,
        Body: fileName.data,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };
    return s3.upload(params, function (s3Err, data) {
        if (s3Err) {
            logger.error("Failed to upload file into S3");
            throw s3Err
        }
        // console.log(`File uploaded successfully at ${data.Location}`);
        path = data.Location;
        response = EventModel.updateEventById(requiredId.entityId, {
            cover_image: path
        });
        ApiResponse.sendResponse(res, 200, "Upload Success", path);
    });
});


router.post('/coupon', async (req, res) => {
    const fileName = req.files.picture;
    const requiredId = FileUploadInputs.getDataFromRequest(req.body);
    if (!fileName) {
        ApiResponse.sendResponse(res, 400, "Unable to get the file ");
        return;
    }

    const folderBucketPathCoupons = 'fit-socials-resources/' + process.env.NODE_ENV + '/coupons';
    const params = {
        // Bucket: 'test-fit-socials/coupons',
        // Bucket: 'fit-socials-resources/coupons',
        Bucket: folderBucketPathCoupons,
        Key: (new Date().getTime()) + req.files.picture.name,
        Body: fileName.data,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };
    return s3.upload(params, function (s3Err, data) {
        if (s3Err) {
            logger.error("Failed to upload file into S3");
            throw s3Err
        }
        // console.log(`File uploaded successfully at ${data.Location}`)
        path = data.Location;
        response = CouponModel.updatCouponById(requiredId.entityId, {
            image_url: path
        });
        ApiResponse.sendResponse(res, 200, "Upload Success", path);
    });
});


router.post('/advertise', async (req, res) => {
    const fileName = req.files.picture;
    const requiredId = FileUploadInputs.getDataFromRequest(req.body);
    if (!fileName) {
        ApiResponse.sendResponse(res, 400, "Unable to get the file ");
        return;
    }

    const folderBucketPathAdvertises = 'fit-socials-resources/' + process.env.NODE_ENV + '/advertises';
    const params = {
        // Bucket: 'test-fit-socials/advertises',
        // Bucket: 'fit-socials-resources/advertises',
        Bucket: folderBucketPathAdvertises,
        Key: (new Date().getTime()) + req.files.picture.name,
        Body: fileName.data,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
        ACL: 'public-read'
    };
    return s3.upload(params, function (s3Err, data) {
        if (s3Err) {
            logger.error("Failed to upload file into S3");
            throw s3Err
        }
        // console.log(`File uploaded successfully at ${data.Location}`)
        path = data.Location;
        response = AdvertisementModel.updateAdvertisementById(requiredId.entityId, {
            advertisement_image: path
        });
        ApiResponse.sendResponse(res, 200, "Upload Success", path);
    });
});

module.exports = router;