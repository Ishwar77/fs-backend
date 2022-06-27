const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const GalleryItemModel = require('./galleryitems.model');
const GalleryItemUtil = require('./galleryitems.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const galleryitems = await GalleryItemModel.getGalleryItem(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Gallery Items", galleryitems);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const galleryitemId = parseInt(req.params.id) || 0;
    const galleryitems = await GalleryItemModel.getGalleryItemById(galleryitemId)
    ApiResponse.sendResponse(res, 200, "Getting all Gallery Item", galleryitems);
});

router.post('/', async (req, res) => {
    const err = GalleryItemUtil.hasError(req.body)
    // console.log('ERROR = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const galleryitems = await GalleryItemModel.createGalleryItems(req.body);
    ApiResponse.sendResponse(res, galleryitems ? 200 : 400, galleryitems ? "Creation Success" : "Creation Failed", galleryitems);
});

router.put('/:id', async (req, res) => {
    const galleryitemId = parseInt(req.params.id) || 0;
    if (!galleryitemId) {
        const msg = "Gallery Item: PUT Id = " + galleryitemId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Gallery Item Id seems invalid", msg);
        return;
    }
    const err = GalleryItemUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
   //console.log('Ctrl, Error = ', err);
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
   const galleryitems = await GalleryItemModel.updateGalleryItemById(galleryitemId, req.body);
    ApiResponse.sendResponse(res, galleryitems ? 200 : 400, galleryitems ?"Update Success" : "Update Failed", {status: galleryitems });
});

router.delete('/:id', async (req, res) => {
    const galleryitemId = parseInt(req.params.id) || 0;
    if (!galleryitemId) {
        const msg = "Gallery Item: PUT Id = " + galleryitemId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Gallery Item Id seems invalid", msg);
        return;
    } 
   const galleryitems = await GalleryItemModel.deleteGalleryItemById(galleryitemId);
    //console.log(galleryitems);
    ApiResponse.sendResponse(res, galleryitems === 1 ? 200 : 400, galleryitems  === 1 ?"Delete Success" : "Deletion Failed", {status: galleryitems });
});
module.exports = router;