const logger = require('../../utils/logger');
const ReviewDAO = require('./review.dao');
const MyConst = require('../utils');
const EventDAO = require('../events-module/event.dao');
const UserDAO = require('../user-module/user.dao');
const Helper = require('../../utils/helper');
const Cryptic = require('../../utils/cryptic');
const uuid = require('uuid-random');
module.exports = class ReviewModel {

    constructor(
        review_id, user_id, event_id, review, ratings, uuid, created_at, updated_at, isActive = 1,
    ) {
        this.review_id = review_id; this.user_id = user_id; this.event_id = event_id;
        this.review = review; this.uuid = uuid; this.ratings = ratings;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
    }

    /**
     * To insert into DB
     * @param obj ReviewModel 
     */
    static async createReview(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + ReviewModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }
        // let uu = uuid(); 
        const data = " " + (JSON.stringify(obj.user_id)) + " " + (JSON.stringify(obj.event_id)) + " " + (JSON.stringify(obj.review));
        let uuids = Cryptic.hash(data);
        const reviewData = {
            user_id: obj.user_id,
            event_id: obj.event_id,
            review: obj.review,
            ratings: obj.ratings,
            uuid: uuids
        }
        let created = null;
        try {

            created = await ReviewDAO.create(reviewData);

        } catch (e) {
            logger.error('Unable to Create Review');
            logger.error(e);
        }
        if (created) {
            return await ReviewModel.getReviewById(created['null'])
        }
        return created;
    }

    /**
     * Utility function to get all Review
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of records
     * @returns any[]
     */
    static async getReview(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await ReviewDAO.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include:
                [
                    { model: UserDAO, as: 'User', allowNull: true },
                    { model: EventDAO, as: 'Event', allowNull: true }
                ]
        });
    }

    /**
     * Utility function to get by Review Id
     * @param ReviewID
     * @returns any
     */
    static async getReviewById(ReviewId = 0) {
        return await ReviewDAO.findOne({
            where: {
                review_id: ReviewId,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include:
                [
                    { model: UserDAO, as: 'User', allowNull: true },
                    { model: EventDAO, as: 'Event', allowNull: true }
                ]
        });
    }

    /**
     * Utility function to get by User Id
     * @param UserId
     * @returns any
     */
    static async getReviewByUserId(UserId = 0) {
        return await ReviewDAO.findAll({
            where: {
                user_id: UserId,
                isActive: 1
            },
            order: [
                ['created_at', 'DESC']
            ],
            include:
                [
                    { model: UserDAO, as: 'User', allowNull: true },
                    { model: EventDAO, as: 'Event', allowNull: true }
                ]
        });
    }

    /**
     * Utility function to get by Event Id
     * @param EventId
     * @returns any
     */
    static async getReviewByEventId(EventId = 0) {
        return await ReviewDAO.findAll({
            where: {
                event_id: EventId
            },
            order: [
                ['created_at', 'DESC']
            ],
            include:
                [
                    { model: UserDAO, as: 'User', allowNull: true },
                    { model: EventDAO, as: 'Event', allowNull: true }
                ]
        });
    }

    /**
     * Utility function to update by Review Id
     * @param ReviewId
     * @params obj
     * @returns any
     */
    static async updateReviewById(ReviewId = 0, obj = null) {
        let updated = null;
        try {
            updated = await ReviewDAO.update(obj, {
                where: {
                    review_id: ReviewId
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Review');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return ReviewModel.getReviewById(ReviewId);
        } else {
            return null;
        }
    }

    /**
     * Utility function to delete by Review Id
     * @param ReviewId
     * @returns any
     */
    static async deleteReviewById(ReviewId = 0, fource = false) {
        if (!fource) {
            const del = await ReviewModel.updateReviewById(ReviewId, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await ReviewDAO.destroy({
            where: {
                review_id: ReviewId
            }
        });
    }


    static async getReviewByUUId(uuid = 0) {
        return await ReviewDAO.findAll({
            where: {
                uuid: uuid,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ],
            include:
                [
                    { model: UserDAO, as: 'User', allowNull: true },
                    { model: EventDAO, as: 'Event', allowNull: true }
                ]
        });
    }

    static async updateReviewByUUId(uuid = 0, obj = null) {
        let updated = null;
        try {
            updated = await ReviewDAO.update(obj, {
                where: {
                    uuid: uuid
                }
            });
        } catch (e) {
            if (!e) {
                updated = [1];
            } else {
                logger.error('Unable to Update Review');
                logger.error(e);
            }
        }
        if (updated && updated.length && updated[0] === 1) {
            return ReviewModel.getReviewByUUId(uuid);
        } else {
            return null;
        }
    }

    static async deleteReviewByUUId(uuid = 0, fource = false) {
        if (!fource) {
            const del = await ReviewModel.updateReviewByUUId(uuid, { isActive: 0 });
            return del ? 1 : 0;
        }
        return await ReviewDAO.destroy({
            where: {
                uuid: uuid
            }
        });
    }
}