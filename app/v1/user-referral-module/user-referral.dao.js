const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const UserDAO = require("../user-module/user.dao");
const uuid = require('uuid-random');
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Address */
const UserReferralDAO = dbInstance.define('UserReferrals', {
    referral_id: {
        type: DataTypes.INTEGER,
        field: 'referral_id',
        primaryKey: true,
        autoIncriment: true
    },
    referrering_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
        foreignKey: true,
        field: 'referrering_user',
        references: {
            model: UserDAO,
            key: 'user_id'
        }
    },
    invited_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
        foreignKey: true,
        field: 'invited_user',
        references: {
            model: UserDAO,
            key: 'user_id'
        }
    },
    points_gained: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'points_gained',
        defaultValue: 200
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: true,
        // defaultValue: uuid()
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
    tableName: 'user_referrals'
});


module.exports = UserReferralDAO;