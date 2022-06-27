const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const UserDAO = require("../user-module/user.dao");
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Address */
const UserPointsDAO = dbInstance.define('UserPoints', {
    id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncriment: true
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        foreignKey: true,
        field: 'user_id',
        references: {
            model: UserDAO,
            key: 'user_id'
        }
    },
    credited_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    debited_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    balance_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true
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
}, {
    timestamps: false,
    tableName: 'user_points'
});


module.exports = UserPointsDAO;