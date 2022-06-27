const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const userDao = require('../user-module/user.dao');
const dbInstance = Helper.dbInstance;
const uuid = require('uuid-random');

/** Sequelize DAO Model, for Batch */
const SessionDAO = dbInstance.define('Session', {
    session_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'session_id',
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
    ip_address: {
        type: DataTypes.STRING,
        primaryKey: true,
        field: 'ip_address',
        autoIncriment: true
    },
    JWT: {
        type: DataTypes.STRING,
        primaryKey: true,
        field: 'JWT',
        autoIncriment: true
    },
    login_time: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'login_time',
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
        tableName: 'session'
    });

module.exports = SessionDAO;