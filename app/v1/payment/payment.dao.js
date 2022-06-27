const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const UserDAO = require('../user-module/user.dao');
const SubscriptionDAO = require('../subscription/subscription.dao');
const EventRegistrationDAO = require('../event-registration/eventregistration.dao');
const AdvertisementDAO = require('../advertisement-module/advertisement.dao');
const dbInstance = Helper.dbInstance;
const uuid = require('uuid-random');


/** Sequelize DAO Model, for Address */
const PaymentDAO = dbInstance.define('Payment', {
    slno: {
        type: DataTypes.INTEGER,
        field: 'slno',
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
    subscription_id: {
        type:  DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'subscription_id',
        foreignKeyConstraint: true,
        references: {
            model: SubscriptionDAO,
            key: 'subscription_id'
        }
    },
    registration_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'registration_id',
        foreignKeyConstraint: true,
        references: {
            model: EventRegistrationDAO,
            key: 'registration_id'
        }
    },
    advertisement_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'advertisement_id',
        foreignKeyConstraint: true,
        references: {
            model: AdvertisementDAO,
            key: 'advertisement_id'
        }
    },
    order_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    payment_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    payment_status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'PENDING'
    },
    signature: {
        type: DataTypes.TEXT,
        allowNull: true
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
}, 
{
    timestamps: false,
    tableName: 'payment'
});

module.exports = PaymentDAO;