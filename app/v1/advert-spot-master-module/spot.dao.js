const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Advertisement Spot */
const AdvrSpotDAO = dbInstance.define('AdvrSpot', {
    spot_number: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'spot_number',
        autoIncriment: true
    },
    spot_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    spot_days: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    spot_amount: {
        type: DataTypes.INTEGER,
        allowNull: true
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
    tableName: 'advertisement_spot_master'
});

module.exports = AdvrSpotDAO;