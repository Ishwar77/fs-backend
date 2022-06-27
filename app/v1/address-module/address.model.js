const AddressDAO = require('./address.dao');
const MyConst = require('../utils');
const logger = require('../../utils/logger');
const uuid = require('uuid-random');
const { Transaction } = require('sequelize');
const Cryptic = require('../../utils/cryptic');
const Helper = require('../../utils/helper');
module.exports = class AddressModel {

    constructor(
        address_id, place, district, state, country, pin_code, created_at, updated_at, isActive = 1, uuid
    ) {
        this.address_id = address_id; this.district = district;
        this.place = place; this.state = state; this.country = country;
        this.pin_code = pin_code; this.uuid = uuid; this.created_at = created_at;
        this.updated_at = updated_at; this.isActive = isActive;
    }


    /**
 * To insert into DB
 * @param obj AddressModel 
 */
    static async createAddress(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + AddressModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        // let uu = uuid(); 
        // let salt = JSON.stringify(new Date().getTime());
        let uu = Cryptic.hash(obj.place);
        // console.log("UUID ", uu);
        // console.log("SALT", salt);

        const addressData = {
            place: obj.place,
            district: obj.district,
            state: obj.state,
            country: obj.country,
            pin_code: obj.pin_code,
            uuid: uu
        }
        let created = null;
        try {
            // created = await Helper.dbInstance.transaction(async t => {
            created = await AddressDAO.create(addressData);
            //  });
        } catch (e) {
            logger.error('Unable to Create Address');
            logger.error(e);
        }
        if (created) {
            return await AddressModel.getAddressById(created['null']);
        }
        return created;
    }


    /**
     * Utility function to get all Address
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getAddress(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        //return await Helper.dbInstance.transaction(async t => {
        return await AddressDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            where: {
                isActive: true
            },
            offset: from,
            limit: limit
        });
        // });
    }

    /**
     * Utility function to get by Address Id
     * @param addressId
     * @returns any
     */
    static async getAddressById(addressId = 0) {
        // return await Helper.dbInstance.transaction(async t => {
        return await AddressDAO.findAll({
            where: {
                address_id: addressId
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
        //  });
    }


    /**
     * Utility function to update by Address Id
     * @param addressId
     * @params obj
     * @returns any
     */
    static async updateAddressById(addressId = 0, obj = null) {

        let updated = null;
        try {
            updated = await AddressDAO.update(obj, {
                where: {
                    address_id: addressId
                }
            });

        } catch (e) {
            logger.error('Unable to Update Adress');
            logger.error(e);
        }

        // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return AddressModel.getAddressById(addressId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Address Id
     * @param addressId
     * @returns any
     */
    static async deleteAddressById(addressId = 0, fource = false) {
        if (!fource) {
            const del = await AddressModel.updateAddressById(addressId, { isActive: 0 });
            return del ? 1 : 0;
        }

        return await AddressDAO.destroy({
            where: {
                address_id: addressId
            }
        });

    }

    //Operations Based on UUIDs
    static async getAddressByUUID(uuid) {
        return await AddressDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async updateAddressByUUId(uuid, obj = null) {
        let updated = null;
        try {
            updated = await AddressDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            logger.error('Unable to Update Adress');
            logger.error(e);
        }
        if (updated && updated.length && updated[0] === 1) {
            return AddressModel.getAddressByUUID(uuid);
        } else {
            return null;
        }
    }

    static async deleteAddressByUUID(uuid, fource = false) {
        if (!fource) {
            const del = await AddressModel.updateAddressByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await AddressDAO.destroy({
            where: {
                uuid: uuid
            }
        });
    }
}