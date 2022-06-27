const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const BatchDao = require('../batch/batch.dao');
const userDao = require('../user-module/user.dao');
const EventDao = require('../events-module/event.dao');
const dbInstance = Helper.dbInstance;
const uuid = require('uuid-random');

/** Sequelize DAO Model, for Batch */
const AttendanceTrackerDAO = dbInstance.define('AttendanceTracker', {
    attendance_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'attendance_id',
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
    batch_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'batch_id',
        references: {
            model: BatchDao,
            key: 'batches_id'
        }
    },
    event_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'event_id',
        references: {
            model: EventDao,
            key: 'event_id'
        }
    },
    trainer_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'trainer_id',
        references: {
            model: userDao,
            key: 'user_id'
        }
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'date'
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
        tableName: 'attendance_tracker'
    });

module.exports = AttendanceTrackerDAO;