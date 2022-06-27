const logger = require('../../utils/logger');
const PointRedemptionDAO = require('./points-redemption.dao');
const PointRedemptionUtil = require('./points-redemption.util');
const MyConst = require('../utils');
const EventModel = require('../events-module/event.model');
const UserModel = require('../user-module/user.model');
const PointModel = require('../user-points/user-points.model');
const Cryptic = require('../../utils/cryptic');
const userDAO = require('../user-module/user.dao');
const EventDao = require('../events-module/event.dao');

module.exports = class PointRedemptionModel {

    constructor(
        id, user_id, event_id, point_id, points, uuid, created_at, updated_at, isActive = 1
    ) {
        this.id = id;
        this.user_id = user_id;
        this.event_id = event_id;
        this.point_id = point_id;
        this.points = points;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.isActive = isActive;
        this.uuid = uuid;
    }

    /**
         * To insert into DB
         * @param obj PR create 
         */
    static async createPointRedemption(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + PointRedemptionModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        //validation
        const error = PointRedemptionUtil.getJoiValidatecreate(obj);
        if (error) {
            logger.error('Error due to bad inputs');
            logger.info('Input ' + JSON.stringify(error));
            return null;
        }
        //validation for matching events
        const matchingevents = await EventModel.getEventById(obj.eventId);
        if (!matchingevents) {
            logger.error('Event doesnt Exist');
            logger.info('Input ' + JSON.stringify(matchingevents));
            return null;
        }
        //validation for matching users
        const matchingusers = await UserModel.getUserById(obj.userId);
        if (!matchingusers) {
            logger.error('User doesnot exist');
            logger.info('Input ' + JSON.stringify(matchingusers));
            return null;
        }
        //validation for matching trainers
        var matchingtrainers = await UserModel.getUserById(obj.trainerId);
        //   console.log(matchingtrainers);
        if (!matchingtrainers) {
            logger.error('Trainer doesnot exist');
            logger.info('Input ' + JSON.stringify(matchingtrainers));
            return null;
        }
        //TODO(to check the point id)
        //validation for matching reward point id
        // const matchingpoints = await PointModel.getbyrewardId(obj && obj.pointId ? obj.pointId : '');
        // if (!matchingpoints) {
        //     logger.error('Reward Point doesnot exist');
        //     logger.info('Input ' + JSON.stringify(matchingpoints));
        //     return null;
        // }


        const redemption = {
            user_id: obj.userId,
            point_id: obj.pointId,
            event_id: obj.eventId,
            trainer_id: obj.trainerId,
            points: obj.points,
            status: 'Requested',
            uuid: Cryptic.hash(new Date().getTime() + '')
        };

        let created = null;
        try {
            return await PointRedemptionDAO.create(redemption);
        } catch (e) {
            logger.error('Unable to Register to the redemption');
            logger.error(e);
        }

        if (created) {
            return await PointsMasterModel.getPointsMasterById(created['null'])
        }
        return created;
    }


    /**
* Utility function to get all PR
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getPointredemption(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await PointRedemptionDAO.findAll({
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: userDAO, as: 'User', allowNull: true
                },
                {
                    model: EventDao, as: 'Event', allowNull: true,
                }
            ],
            offset: from,
            limit: limit
        });
    }


    /**
     * Utility function to get by PR based on user_id
     * @param userId
     * @returns any
     */

    static async getbyredemptionbyuserId(userId = 0) {
        return await PointRedemptionDAO.findAll({
            where: {
                user_id: userId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: userDAO, as: 'User', allowNull: true
                },
                {
                    model: EventDao, as: 'Event', allowNull: true,
                }
            ],
        });
    }

    /**
 * Utility function to get by PR based on trainer_id
 * @param trainerId
 * @returns any
 */

    static async getbyredemptionbytrainerId(trainerId = 0) {
        return await PointRedemptionDAO.findAll({
            where: {
                trainer_id: trainerId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: userDAO, as: 'User', allowNull: true
                },
                {
                    model: EventDao, as: 'Event', allowNull: true,
                }
            ],
        });
    }

    /**
* Utility function to get by PR based on event_id
* @param eventId
* @returns any
*/

    static async getbyredemptionbyeventId(eventId = 0) {
        return await PointRedemptionDAO.findAll({
            where: {
                event_id: eventId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: userDAO, as: 'User', allowNull: true
                },
                {
                    model: EventDao, as: 'Event', allowNull: true,
                }
            ],
        });
    }

    /**
 * Utility function to get by PR based on id
 * @param Id
 * @returns any
 */

    static async getbyredemptionbyId(Id = 0) {
        return await PointRedemptionDAO.findAll({
            where: {
                id: Id,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                {
                    model: userDAO, as: 'User', allowNull: true
                },
                {
                    model: EventDao, as: 'Event', allowNull: true,
                }
            ],
        });
    }

    /**
     * Utility function to update by PR Id
     * @param userId
     * @params obj
     * @returns any
     */
    static async updateredemptionById(userId = 0, obj = null) {
        let updated = null;
        try {
            updated = await PointRedemptionDAO.update(obj, {
                where: {
                    user_id: userId
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Point redemption');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return PointRedemptionModel.getbyredemptionbyuserId(userId);
        } else {
            return null;
        }
    }

    /**
 * Utility function to update by PR Id
 * @param userId
 * @params obj
 * @returns any
 */
    static async rejectredemptionById(userId = 0) {
        let updated = null;
        const update = {
            isActive: 0,
            status: "Rejected"
        }
        try {
            updated = await PointRedemptionDAO.update(update, {
                where: {
                    user_id: userId
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Point redemption');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return PointRedemptionModel.getbyredemptionbyuserId(userId);
        } else {
            return null;
        }
    }


    /**
 * Utility function to delete by PR Id
 * @param Id
 * @returns any
 */
    static async deleteredemptionById(Id = 0) {
        return await PointRedemptionDAO.destroy({
            where: {
                id: Id
            }
        });
    }
}