const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const UserDAO = require('../user-module/user.dao');
const RegistrationDAO = require('../event-registration/eventregistration.dao');
const RegistrationBatchDAO = require('../event-registration-batches/event-reg-batch.dao');
const BatchesDAO = require('../batch/batch.dao');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Batch Switch */
const BatchSwitchDAO = dbInstance.define('BatchSwitch', {
    batch_switch_id: {
        type: DataTypes.INTEGER,
        field: 'batch_switch_id',
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
    registration_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'registration_id',
        references: {
            model: RegistrationDAO,
            key: 'registration_id'
        }
    },
    batch_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'batch_id',
        references: {
            model: BatchesDAO,
            key: 'batches_id'
        }
    },
    reg_batch_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'reg_batch_id',
        references: {
            model: RegistrationBatchDAO,
            key: 'reg_batch_id'
        }
    },
    day_of_week: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'day_of_week'
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
    }
},
{
    timestamps: false,
    tableName: 'batch_switch'
})
module.exports = BatchSwitchDAO;