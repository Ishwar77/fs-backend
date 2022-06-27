const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const EventDAO = require('../events-module/event.dao');
const UserDAO = require('../user-module/user.dao');
const dbInstance = Helper.dbInstance;


/** Review DAO Model, for Review */
const ReviewDAO = dbInstance.define('Review', {
    review_id: {
        type: DataTypes.INTEGER,
        field: 'review_id',
        primaryKey: true,
        autoIncriment: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'user_id',
        references: {
            model: UserDAO,
            key: 'user_id'
        }
    },
    event_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'event_id',
        references: {
            model: EventDAO,
            key: 'event_id'
        }
    },
    review: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ratings: {
        type: DataTypes.STRING,
        allowNull: false
    },
    uuid: {
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
    tableName: 'review'
});

module.exports = ReviewDAO;