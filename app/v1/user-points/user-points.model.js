const logger = require('../../utils/logger');
const UserPointsDao = require('./user-points.dao');
const UserRoleMasterDAO = require('../user-role-master/user-role-master.dao');
const MyConst = require('../utils');
const UserDao = require('../user-module/user.dao');
const Cryptic = require('../../utils/cryptic');
const Helper = require('../../utils/helper');
const UserModel = require('../user-module/user.model');
const PointredemptionModel = require('../points-redemption/points-redemption.model');


const UserPointsIdType = {
    'ID': 'id',
    'UUID': 'uuid',
    'USER_ID': 'user_id'
};

class UserPointsModel {

    constructor(
        user_id, uuid, credited_points, debited_points, comment, isActive, created_at, updated_at
    ) {
        this.user_id = user_id;
        this.credited_points = credited_points;
        this.created_at = created_at; this.updated_at = updated_at; this.isActive = isActive;
        this.debited_points = debited_points; this.uuid = uuid; this.comment = comment;
    }

    static test() {
        console.log(100);
    }

    /**
     * To insert into DB
     */
    static async create(obj) {
        if (!obj) {
            const err = "Expecting input of type,'" + UserPointsModel + "', recieved " + JSON.stringify(obj);
            logger.error(err);
            return null;
        }

        const user = await UserModel.getUserById(obj.user_id);
        if (!user) {
            const err = "Reward points Creation Failed, User do not exists";
            logger.error(err);
            logger.info(JSON.stringify(obj));
            return null;
        }

        const existingSum = await UserPointsModel.getLatestBalancePoints(obj.user_id) || {};
        //    console.log('existingSum = ', existingSum);

        obj['balance_points'] = 0;

        if (!obj['credited_points']) {
            obj['credited_points'] = 0;
        }

        if (!obj['debited_points']) {
            obj['debited_points'] = 0;
        }

        const newPoints = obj['credited_points'] - obj['debited_points'];
        // console.log('newPoints = ', newPoints);

        if (!existingSum || !existingSum['balance_points']) {
            existingSum['balance_points'] = 0;
        }

        obj['balance_points'] = existingSum['balance_points'] + newPoints;

        // console.log(obj);
        // if(1 === 1) {

        //     return;
        // }

        const data = obj.user_id + '' + (new Date()).getTime();
        let uuid = Cryptic.hash(data);
        //  console.log("uuid = ", uuid);
        obj['uuid'] = obj['uuid'] ? obj['uuid'] : uuid;

        let created = null;
        try {
            //    console.log('Obj = ', obj);

            created = await UserPointsDao.create(obj);
        } catch (e) {
            logger.error('Unable to Create UserReferral');
            logger.error(e);
        }

        if (created) {
            return await UserPointsModel.getByIds(created['null']);
        }

        return created;
    }

    /**
     * Utility function to get all
     * @param from Number, recoard Offset, Get result from
     * @param limit Number, max number of recoards
     * @returns any[]
     */
    static async getAll(from = MyConst.ResultSetUtil.DEFAULT_OFFSET,
        limit = MyConst.ResultSetUtil.DEFAULT_LIMIT) {
        return await UserPointsDao.findAll({
            offset: from,
            limit: limit,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true
            },
            include: [
                {
                    model: UserDao, as: 'User', allowNull: true,
                    include: [
                        { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true }
                    ]
                }
            ]
        });
    }


    static async getLatestBalancePoints(userId) {

        return await UserPointsDao.findOne({
            attributes: ['balance_points'],
            offset: 0,
            limit: 1,
            order: [['created_at', 'DESC']],
            where: {
                isActive: true,
                user_id: userId
            }
        });
    }


    /**
     * A generic Get by ID method, that can fetch by refering 'id', 'uuid' or 'user_id' columns
     * @param id
     * @param idType = 'id' | 'uuid' | 'user_id
     * @returns any
     */
    static async getByIds(id = 0, idType = UserPointsIdType.ID) {
        const whr = {};

        whr[`${idType}`] = id;

        if (idType !== UserPointsIdType.USER_ID) {
            // One matching Object
            return await UserPointsDao.findOne({
                where: whr,
                order: [
                    ['created_at', 'DESC']
                ],
                include: [
                    {
                        model: UserDao, as: 'User', allowNull: true,
                        include: [
                            { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true }
                        ]
                    }
                ]
            });
        } else {
            // Multiple  matching Object
            return await UserPointsDao.findAll({
                where: whr,
                order: [
                    ['created_at', 'DESC']
                ],
                include: [
                    {
                        model: UserDao, as: 'User', allowNull: true,
                        include: [
                            { model: UserRoleMasterDAO, as: 'UserRoleMaster', allowNull: true }
                        ]
                    }
                ]
            });
        }
    }

    /**
* Utility function to get by PR based on user id
* @param userID
* @returns any
*/
    static async getbyuserId(userID = 0) {
        return await UserPointsDao.findAll({
            where: {
                user_id: userID,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    /**
* Utility function to get by PR based on user id
* @param ids
* @returns any
*/
    static async getbyrewardId(ids = 0) {
        return await UserPointsDao.findAll({
            where: {
                id: ids,
                isActive: true
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }

    static async updateById(obj = null) {
        if (!obj) {
            return;
        }
        const points = await UserPointsModel.getbyuserId(obj.userId ? obj.userId : '');
        if (!points && !points.length) {
            logger.info("Points doesnot exist");
            return null;
        }
        var value = (points[0].balance_points * obj.value) / 100;
        // const update = {
        //     debited_points: points[0].debited_points + value,
        //     balance_points: points[0].balance_points - value
        // }
        // if (update.balance_points > points[0].balance_points) {
        //     return null;
        // }
        const updatable = {
            uuid: Cryptic.hash(new Date().getTime() + ''),
            user_id: obj.userId,
            credited_points: 0,
            debited_points: points[0].debited_points + value,
            isActive: 1,
            balance_points: points[0].balance_points - value,
            comment: 'Coupon Redemption'
        }
        if (updatable.balance_points > points[0].balance_points) {
            return null;
        }
        let created = null;
        try {
            created = await UserPointsDao.create(updatable);
        } catch (e) {
            logger.error('Unable to Register to the redemption');
            logger.error(e);
        }

        if (created) {
            return await UserPointsModel.getByIds(points && points.length ? points[0].id : '');
        }
        return created;
        // try {
        //     updated = await UserPointsDao.update(update, {
        //         where: {
        //             id: points && points.length ? points[0].id : ''
        //         }
        //     });
        // } catch (e) {
        //     if (!e) {
        //         updated = [1];
        //     } else {
        //         logger.error('Unable to Update User');
        //         logger.error(e);
        //     }
        // }
        // if (updated && updated.length && parseInt(updated[0]) === 1) {
        //     return await UserPointsModel.getByIds(points && points.length ? points[0].id : '');
        // } else {
        //     return null;
        // }
    }


    /**
     * Utility function to delete by Id
     * Soft delete , because this table will be refered by other dependent tables
     * @param referralId
     * @returns any
     */
    static async deleteById(id = 0, fource = false) {
        if (!fource) {
            const del = await UserPointsDao.updateById(id, { isActive: 0 });
            return del ? 1 : 0;
        }

        return await UserPointsDao.destroy({
            where: {
                id: id
            }
        });
    }


}

module.exports = UserPointsModel;