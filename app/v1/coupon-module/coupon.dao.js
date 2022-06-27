const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const EventDAO = require('../events-module/event.dao');
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Address */
const CouponDAO = dbInstance.define('Coupon', {
    coupon_id: {
        type: DataTypes.INTEGER,
        field: 'coupon_id',
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
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'title'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'description'
    },
    image_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'image_url'
    },
    discount_percent: {
        // In percentage
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1,
        field: 'discount_percent'
    },
    max_discount_amount: {
        // In rupees
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1,
        field: 'max_discount_amount'
    },
    max_usage_count: {
        // Maximum number of people allowed to used this coupone
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'max_usage_count'
    },
    usage_count: {
        // Number of people using this coupone
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'usage_count'
    },
    expiry: {
        // Date when this Cupon expires
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        field: 'expiry'
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
    isPrivate: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
}, {
    timestamps: false,
    tableName: 'coupon'
});

module.exports = CouponDAO;