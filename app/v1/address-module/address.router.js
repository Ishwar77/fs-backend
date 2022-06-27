const express = require("express");
const router = express.Router();
const logger = require('../../utils/logger');
const ApiResponse = require('../../models/apiResponse');
const AddressModel = require('./address.model');
const AddressUtil = require('./address.util');
const MyConst = require('../utils');
const Authorize = require('../middlewares/authorize');

router.get('/', Authorize.verifyJWT, async (req, res) => {
    const from = parseInt(req.query.from) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const addresses = await AddressModel.getAddress(from, limit)
    ApiResponse.sendResponse(res, 200, "Getting all Addresses", addresses);
});

router.get('/:id', Authorize.verifyJWT, async (req, res) => {
    const addressId = parseInt(req.params.id) || 0;
    const addresses = await AddressModel.getAddressById(addressId)
    ApiResponse.sendResponse(res, 200, "Getting Address", addresses);
});

router.post('/', Authorize.verifyJWT, async (req, res) => {
    // Validate the Model
    const err = AddressUtil.hasError(req.body)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const addresses = await AddressModel.createAddress(req.body);

    ApiResponse.sendResponse(res, addresses ? 200 : 400, addresses ? "Creation Success" : "Creation Failed", addresses);
});

router.put('/:id', Authorize.verifyJWT, async (req, res) => {
    const addressId = parseInt(req.params.id) || 0;

    if (!addressId) {
        const msg = "Address: PUT Id = " + addressId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Address Id seems invalid", msg);
        return;
    }

    const err = AddressUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)

    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }

    const addresses = await AddressModel.updateAddressById(addressId, req.body);

    ApiResponse.sendResponse(res, addresses ? 200 : 400, addresses ? "Update Success" : "Update Failed", { status: addresses });
});

router.delete('/:id', Authorize.verifyJWT, async (req, res) => {
    const addressId = parseInt(req.params.id) || 0;

    if (!addressId) {
        const msg = "Address: PUT Id = " + addressId + ", is invalid, body  " + JSON.stringify(req.body);
        logger.warn(msg);
        ApiResponse.sendResponse(res, 400, "Address Id seems invalid", msg);
        return;
    }

    const addresses = await AddressModel.deleteAddressById(addressId);
   // console.log(addresses);
    ApiResponse.sendResponse(res, addresses === 1 ? 200 : 400, addresses === 1 ? "Delete Success" : "Deletion Failed", { status: addresses });
});

//Operations On UUIDs
router.get('/uuid/:id', Authorize.verifyJWT, async (req, res) => {
    const addresses = await AddressModel.getAddressByUUID(req.params.id)
    ApiResponse.sendResponse(res, 200, "Getting Address", addresses);
});


router.put('/updateonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const err = AddressUtil.hasError(req.body, MyConst.ValidationModelFor.UPDATE)
    if(err) {
        ApiResponse.sendResponse(res, 400, "Creation failed due to bad Inputs", err);
        return;
    }
    const addresses = await AddressModel.updateAddressByUUId(req.params.id, req.body);
    ApiResponse.sendResponse(res, addresses ? 200 : 400, addresses ? "Update Success" : "Update Failed", { status: addresses });
});


router.delete('/deleteonuuid/:id', Authorize.verifyJWT, async (req, res) => {
    const addresses = await AddressModel.deleteAddressByUUID(req.params.id);
    ApiResponse.sendResponse(res, addresses === 1 ? 200 : 400, addresses === 1 ? "Delete Success" : "Deletion Failed", { status: addresses });
});
module.exports = router;