const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');

const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Address */
const EventMasterDAO = dbInstance.define('EventMaster', {
    event_master_id: {
        type: DataTypes.INTEGER,
        field: 'event_master_id',
        primaryKey: true,
        autoIncriment: true
    },
    event_master_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
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
    tableName: 'event_master'
});

module.exports = EventMasterDAO;