const logger = require('../../utils/logger');
const TrainerRatingsDao = require('./trainer-ratings.dao');
const TrainerRatingUtil = require('./trainer-ratings.util');
const userDAO = require('../user-module/user.dao');
const MyConst = require('../utils');
const UserModel = require('../user-module/user.model');
const Cryptic = require('../../utils/cryptic');
const { Op, DataTypes } = require("sequelize");

module.exports = class TrainerRatingModel {

    constructor(
        rating_id, user_id,
        trainer_id, ratings, uuid,
        created_at, updated_at, isActive = 1
    ) {
        this.rating_id = rating_id;
        this.user_id = user_id;
        this.trainer_id = trainer_id;
        this.ratings = ratings;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.isActive = isActive;
        this.uuid = uuid;
    }

    /**
         * To insert into DB
         * @param obj Ratingcreate 
         */
    static async createTrainerreview(obj) {
        console.log(obj);
        if (!obj) {
            const err = "Expecting input of type,'" + TrainerRatingModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        const error = TrainerRatingUtil.getJoiValidatecreate(obj);
        if (error) {
            logger.error('Error due to bad inputs');
            logger.info('Input ' + JSON.stringify(error));
            return null;
        }
        const matchingUsers = await UserModel.getUserById(obj.userId);
        if (!matchingUsers) {
            logger.error('User doesnot Exist');
            logger.info('Input ' + JSON.stringify(matchingUsers));
            return null;
        }
        const matchingTrainers = await UserModel.getUserById(obj.trainerId);
        if (!matchingTrainers) {
            logger.error('Trainer doesnot Exist');
            logger.info('Input ' + JSON.stringify(matchingTrainers));
            return null;
        }

        const updatable = {
            user_id: obj.userId,
            trainer_id: obj.trainerId,
            ratings: obj.ratings,
            uuid: Cryptic.hash(new Date().getTime() + '')
        }
        let created = null;
        try {
            created = await TrainerRatingsDao.create(updatable);
        } catch (e) {
            logger.error('Unable to Create Ratings');
            logger.error(e);
        }

        if (created) {
            return await TrainerRatingModel.getbyuserId(obj.userId)
        }

        return created;
    }


    /**
* Utility function to get all Ratings
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getTrainerrating(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await TrainerRatingsDao.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            offset: from,
            limit: limit
        });
    }


    /**
     * Utility function to get by Rating based on trainer_id
     * @param trainerId
     * @returns any
     */

    static async getbytrainerId(trainerId = 0) {
        return await TrainerRatingsDao.findAll({
            where: {
                trainer_id: trainerId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }
    /**
 * Utility function to get by Rating based on user_id
 * @param userId
 * @returns any
 */

    static async getbyuserId(userId = 0) {
        return await TrainerRatingsDao.findAll({
            where: {
                user_id: userId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    /**
     * Utility function to update by user Id
     * @param userId
     * @params obj
     * @returns any
     */
    static async updateratingByuserId(userId = 0, obj = null) {
        let updated = null;
        try {
            updated = await TrainerRatingsDao.update(obj, {
                where: {
                    user_id: userId
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Ratings');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return TrainerRatingModel.getbyuserId(userId);
        } else {
            return null;
        }
    }


    /**
 * Utility function to delete by Rating Id
 * @param ratingId
 * @returns any
 */
    static async deleteratingsById(ratingId = 0) {
        return await TrainerRatingsDao.destroy({
            where: {
                rating_id: ratingId
            }
        });
    }
}