const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const userDao = require('../user-module/user.dao');
const dbInstance = Helper.dbInstance;
const uuid = require('uuid-random');

/** Sequelize DAO Model, for Batch */
const TrainerRatingDAO = dbInstance.define('TrainerRating', {
    rating_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'rating_id',
        autoIncriment: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
        field: 'user_id',
        references: {
            model: userDao,
            key: 'user_id'
        }
    },
    trainer_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
        field: 'trainer_id',
        references: {
            model: userDao,
            key: 'user_id'
        }
    },
    ratings: {
        type: DataTypes.INTEGER,
        foreignKey: false,
        allowNull: false,
        field: 'ratings'
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
        tableName: 'trainer_ratings'
    });

module.exports = TrainerRatingDAO;