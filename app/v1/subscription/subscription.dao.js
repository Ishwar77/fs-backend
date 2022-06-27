const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const EventDAO = require('../events-module/event.dao');
const dbInstance = Helper.dbInstance;
const uuid = require('uuid-random');


/** Sequelize DAO Model, for Subscription */
const SubscriptionDAO = dbInstance.define('Subscription', {
    subscription_id: {
        type: DataTypes.INTEGER,
        field: 'subscription_id',
        primaryKey: true,
        autoIncriment: true
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
    days: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tax: {
        type: DataTypes.STRING,
        allowNull: false
    },
    batch_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 1
    },
    duration_unit: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'DAILY'
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: uuid()
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
    tableName: 'subscription'
});

module.exports = SubscriptionDAO;