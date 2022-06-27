const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const UserDAO = require('../user-module/user.dao');
const SubscriptionDAO = require('../subscription/subscription.dao');
const dbInstance = Helper.dbInstance;
const CouponDao = require('../coupon-module/coupon.dao');
const uuid = require('uuid-random');
const EventDAO = require('../events-module/event.dao');


/** Sequelize DAO Model, for Event Registration */
const EventRegistrationDAO = dbInstance.define('EventRegistration', {
    registration_id: {
        type: DataTypes.INTEGER,
        field: 'registration_id',
        primaryKey: true,
        autoIncriment: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'user_id',
        foreignKeyConstraint: true,
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
        foreignKeyConstraint: true,
        references: {
            model: EventDAO,
            key: 'event_id'
        }
    },
    coupon_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'coupon_id',
        foreignKeyConstraint: true,
        references: {
            model: CouponDao,
            key: 'coupon_id'
        }
    },
    subscription_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'subscription_id',
        references: {
            model: SubscriptionDAO,
            key: 'subscription_id'
        }
    },
    final_amount: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'final_amount'
    },
    expiry_date: {
        type: DataTypes.DATE,
        allowNull:true,
        field: 'expiry_date'
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'PAID'
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
    tableName: 'registration'
});

// EventRegistrationDAO.hasOne(UserDAO, {
//     foreignKey: 'user_id'
// });
// UserDAO.belongsTo(EventRegistrationDAO, {
//     foreignKey: 'user_id'
// })

module.exports = EventRegistrationDAO;