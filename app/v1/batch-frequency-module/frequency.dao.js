const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Event Frequency */
const FrequencyDAO = dbInstance.define('Frequency', {
    frequency_id: {
        type: DataTypes.INTEGER,
        field: 'frequency_id',
        primaryKey: true,
        autoIncriment: true
    },
    frequency: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'frequency'
    },
    order: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'order'
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
    tableName: 'event_batch_frequency'
});

module.exports = FrequencyDAO;