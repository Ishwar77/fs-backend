const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const userDao = require('../user-module/user.dao');
const EventDao = require('../events-module/event.dao');
const PointDao = require('../user-points/user-points.dao');
const dbInstance = Helper.dbInstance;
const uuid = require('uuid-random');

/** Sequelize DAO Model, for Batch */
const PointRedemptionDAO = dbInstance.define('PointRedemption', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'id',
        autoIncriment: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'user_id',
        references: {
            model: userDao,
            key: 'user_id'
        }
    },
    event_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'event_id',
        references: {
            model: EventDao,
            key: 'event_id'
        }
    },
    trainer_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'trainer_id',
        references: {
            model: userDao,
            key: 'user_id'
        }
    },
    point_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'point_id',
        references: {
            model: PointDao,
            key: 'id'
        }
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'points'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'status'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
        defaultValue: DataTypes.NOW
    },
    isActive: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: uuid()
    },
},
    {
        timestamps: false,
        tableName: 'point_redemption'
    });

module.exports = PointRedemptionDAO;