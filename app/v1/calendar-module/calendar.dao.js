const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Calendar */
const CalendarDAO = dbInstance.define('Calendar', {
    calendar_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'calendar_id',
        autoIncriment: true
    },
    event_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
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
    tableName: 'calendar'
});

module.exports = CalendarDAO;