const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const RegistrationDao = require('../event-registration/eventregistration.dao');
const BatchDao = require('../batch/batch.dao');
const dbInstance = Helper.dbInstance;
const uuid = require('uuid-random');

/** Sequelize DAO Model, for Batch */
const RegistrationBatchDAO = dbInstance.define('RegistrationBatch', {
    reg_batch_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'reg_batch_id',
        autoIncriment: true
    },
    registration_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'registration_id',
        references: {
            model: RegistrationDao,
            key: 'registration_id'
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
    day_of_week: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'day_of_week'
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
},
    {
        timestamps: false,
        tableName: 'registration_batches'
    });

module.exports = RegistrationBatchDAO;