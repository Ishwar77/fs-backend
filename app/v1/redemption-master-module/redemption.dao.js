const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');

const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Points Master */
const RedemptionMasterDAO = dbInstance.define('RedemptionMaster', {
    id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncriment: true
    },
    action_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    percentage_value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
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
    tableName: 'redemption_master'
});

module.exports = RedemptionMasterDAO;