const logger = require('../../utils/logger');
const FitnessInfoDAO = require('./fitnessinfo.dao');
const MyConst = require('../utils');
const UserDao = require('../user-module/user.dao');
const UserRoleMasterDAO = require('../user-role-master/user-role-master.dao');
const AddressDAO = require('../address-module/address.dao');
const uuid = require('uuid-random');
const { Transaction } = require('sequelize');
const Cryptic = require('../../utils/cryptic');
const Helper = require('../../utils/helper');

module.exports = class FitnessInfoModel {

    constructor(
        fitness_info_id, user_id, height, weight, BMI, created_at, updated_at, isActive = 1, uuid
    ) {
        this.fitness_info_id = fitness_info_id; this.user_id = user_id;
        this.height = height; this.weight = weight; this.BMI = BMI; this.uuid = uuid;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj FitnessInfoModel
     */
    static async createFitnessInfo(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + FitnessInfoModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        // let uu = uuid(); 
        const data = " " + (JSON.stringify(obj.user_id)) + " " + (JSON.stringify(obj.weight));
        let uuids = Cryptic.hash(data);
        // console.log("UUID ", uu);
        const fitnessInfoData = {
            user_id: obj.user_id,
            height: obj.height,
            weight: obj.weight,
            BMI: obj.BMI,
            uuid: uuids
        }
        let created = null;
        try {

            return await FitnessInfoDAO.create(fitnessInfoData);

        } catch (e) {
            logger.error('Unable to Create Fitness Info');
            logger.error(e);
        }

        if (created) {
            return await FitnessInfoModel.getFitnessInfoById(created['null'])
        }

        return created;
    }

    /**
 * Utility function to get all FitnessInfo
 * @param from Number, recoard Offset, Get result from
 * @param limit Number, max number of recoards
 * @returns any[]
 */
    static async getFitnessInfo(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await FitnessInfoDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                {
                    model: UserDao, as: 'User', include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster' },
                        { model: AddressDAO, as: 'Address' }
                    ]
                },
            ]
        });
    }

    /**
     * Utility function to get by Fitness Info Id
     * @param fitnessinfoId
     * @returns any
     */
    static async getFitnessInfoById(fitnessinfoId = 0) {

        return await FitnessInfoDAO.findOne({
            where: {
                fitness_info_id: fitnessinfoId
            },
            include: [
                {
                    model: UserDao, as: 'User', include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster' },
                        { model: AddressDAO, as: 'Address' }
                    ]
                },
            ]
        });
    }

    static async getFitnessInfoByUserId(userId = 0) {

        return await FitnessInfoDAO.findOne({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: UserDao, as: 'User', include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster' },
                        { model: AddressDAO, as: 'Address' }
                    ]
                },
            ]
        });
    }


    /**
         * Utility function to update by Fitness Info Id
         * @param fitnessinfoId
         * @params obj
         * @returns any
         */
    static async updateFitnessInfoById(fitnessinfoId = 0, obj = null) {
        let updated = null;
        // console.log('Updating, ', fitnessinfoId, obj);
        try {

            return await FitnessInfoDAO.update(obj, {
                where: {
                    fitness_info_id: fitnessinfoId
                }
            });
        } catch (e) {
            // console.log('Catch Update = ', e);
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Fitness Info');
                logger.error(e);
            }
        }
       // console.log('updated = ', updated);
        if (updated && updated.length && updated[0] === 1) {
            return FitnessInfoModel.getFitnessInfoById(fitnessinfoId);
        } else {
            return null;
        }
    }


    /**
     * Utility function to delete by Fitness Info Id
     * @param fitnessinfoId
     * @returns any
     */
    static async deleteFitnessInfoById(fitnessinfoId = 0, fource = false) {
        if (!fource) {
            const del = await FitnessInfoModel.updateFitnessInfoById(fitnessinfoId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await FitnessInfoDAO.destroy({
            where: {
                fitness_info_id: fitnessinfoId
            }
        });
    }


//Operations on UUID
static async getFitnessInfoByUUId(uuid = 0) {
    return await FitnessInfoDAO.findAll({
        where: {
            uuid: uuid,
            isActive: true
        },
        include: [
            {
                model: UserDao, as: 'User', include: [
                    { model: UserRoleMasterDAO, as: 'UserRoleMaster' },
                    { model: AddressDAO, as: 'Address' }
                ]
            },
        ]
    });
}

static async updateFitnessInfoByUUId(uuid = 0, obj = null) {
    let updated = null;
    try {
        return await FitnessInfoDAO.update(obj, {
            where: {
                uuid: uuid
            }
        });
    } catch (e) {
        if (!e) {
            updated = [1];
        } else {
            logger.error('Unable to Update Fitness Info');
            logger.error(e);
        }
    }
    if (updated && updated.length && updated[0] === 1) {
        return FitnessInfoModel.getFitnessInfoByUUId(uuid);
    } else {
        return null;
    }
}

static async deleteFitnessInfoByUUId(uuid = 0, fource = false) {
    if (!fource) {
        const del = await FitnessInfoModel.updateFitnessInfoByUUId(uuid, { isActive: 0 });
        return del ? 1 : 0;
    }
    return await FitnessInfoDAO.destroy({
        where: {
            uuid: uuid
        }
    });
}
}