const logger = require('../../utils/logger');
const sessionutil = require('./session.util');
const sessionDao = require('./session.dao');
const userDAO = require('../user-module/user.dao');
const MyConst = require('../utils');
const Usermodel = require('../user-module/user.model');
const Cryptic = require('../../utils/cryptic');

module.exports = class SessionModel {

    constructor(
        session_id, user_id, ip_address, JWT, login_time, updated_at, isActive = 1, uuid
    ) {
        this.session_id = session_id;
        this.user_id = user_id;
        this.ip_address = ip_address;
        this.JWT = JWT;
        this.login_time = login_time;
        this.updated_at = updated_at;
        this.isActive = isActive;
        this.uuid = uuid;
    }

    /**
         * To insert into DB
         * @param obj SessionRegistration 
         */
    static async createSession(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + SessionModel.name + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        const error = sessionutil.getJoiValidatecreate(obj);
        if (error) {
            logger.error('Error due to bad inputs');
            logger.info('Input ' + JSON.stringify(error));
            return null;
        }
        const matchingusers = await Usermodel.getUserById(obj.userId);
        if (!matchingusers) {
            logger.error("User doesnot exist");
            logger.info('Input ' + JSON.stringify(matchingusers));
            return null;
        }

        const sessionData = {
            user_id: obj.userId,
            ip_address: obj.ip,
            JWT: obj.jwt,
            uuid: Cryptic.hash(new Date().getTime() + '')
        }
        let created = null;
        try {
            created = await sessionDao.create(sessionData);
        } catch (e) {
            logger.error('Unable to Create Session');
            logger.error(e);
        }

        if (created) {
            return await SessionModel.getUsersbasedonuserId(created['null'])
        }

        return created;
    }


    /**
* Utility function to get all Sessions
* @param from Number, recoard Offset, Get result from
* @param limit Number, max number of recoards
* @returns any[]
*/
    static async getsession(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {

        return await sessionDao.findAll({
            order: [
                ['login_time', 'DESC']
            ],
            include: [
                {
                    model: userDAO, as: 'User', allowNull: true
                }
            ],
            offset: from,
            limit: limit
        });
    }


    /**
     * Utility function to get by session based on user_id
     * @param userId
     * @returns any
     */

    static async getUsersbasedonuserId(userId = 0) {
        return await sessionDao.findAll({
            where: {
                user_id: userId,
                isActive: true
            },
            order: [
                ['login_time', 'DESC']
            ],
            include: [
                {
                    model: userDAO, as: 'User', allowNull: true
                }
            ]
        });
    }

    /**
 * Utility function to delete by User Id
 * @param userId
 * @returns any
 */
    static async deletesessionById(userId = 0) {
        return await sessionDao.destroy({
            where: {
                user_id: userId
            }
        });
    }
}