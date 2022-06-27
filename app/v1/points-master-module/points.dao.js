const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');

const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Points Master */
const PointsMasterDAO = dbInstance.define('PointsMaster', {
    points_id: {
        type: DataTypes.INTEGER,
        field: 'points_id',
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
    tableName: 'points_master'
});

module.exports = PointsMasterDAO;