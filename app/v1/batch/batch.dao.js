const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const EventDAO = require('../events-module/event.dao');
const SubscriptionDAO = require('../subscription/subscription.dao');
const FrequencyDAO = require('../batch-frequency-module/frequency.dao');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Batch */
const BatchesDAO = dbInstance.define('Batch', {
    batches_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'batches_id',
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
    start_time: {
        type: DataTypes.STRING,
        allowNull: true
    },
    end_time: {
        type: DataTypes.STRING,
        allowNull: true
    },
    has_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    batch_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    frequency: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'frequency',
        references: {
            model: FrequencyDAO,
            key: 'frequency_id'
        }
    },
    available_seats: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    frequency_config: {
        type: DataTypes.STRING,
        allowNull: true
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
    inProgress: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    meeting_links: {
        type: DataTypes.STRING,
        allowNull: true
    }
},
    {
        timestamps: false,
        tableName: 'batches'
    });

module.exports = BatchesDAO;