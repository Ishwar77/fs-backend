const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const GalleryModel = require('./gallery.model');
const GalleryUtil = require('./gallery.util');
const MyConst = require('../utils');

router.get('/', async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const galleries = await GalleryModel.getGallery(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Gallery", galleries);
});

router.get('/:id', async (req, res) => {
    const galleryId = parseInt(req.params.id) || 0;
    const galleries = await GalleryModel.getGalleryById(galleryId)
    ApiResponse.sendResponse(res, 200, "Getting all Gallery", galleries);
});

router.post('/', async (req, res) => {
    const err = GalleryUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const galleries = await GalleryModel.createGallery(req.body);
    ApiResponse.sendResponse(res, galleries ? 200 : 400, galleries ? "Creation Success" : "Creation Failed", galleries);

});

router.put('/:id', async (req, res) => {
    const galleryId = parseInt(req.params.id) || 0;
    if (!galleryId) {
        const msg = "Gallery: PUT Id = " + galleryId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Gallery Id seems invalid", msg);
        return;
    }

    const err = GalleryUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const galleries = await GalleryModel.updateGalleryById(galleryId, req.body);
    ApiResponse.sendResponse(res, galleries ? 200 : 400, galleries ?"Update Success" : "Update Failed", {status: galleries });
});

router.delete('/:id', async (req, res) => {
    const galleryId = parseInt(req.params.id) || 0;
    if (!galleryId) {
        const msg = "Gallery: PUT Id = " + galleryId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Gallery Id seems invalid", msg);
        return;
    } 
   const galleries = await GalleryModel.deleteGalleryById(galleryId);
    console.log(galleries);
    ApiResponse.sendResponse(res, galleries === 1 ? 200 : 400, galleries  === 1 ?"Delete Success" : "Deletion Failed", {status: galleries });
});
module.exports = router;