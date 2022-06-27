const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Media */
const MediaMasterDAO = dbInstance.define('MediaMaster', {
    media_type_id: {
        type: DataTypes.INTEGER,
        field: 'media_type_id',
        primaryKey: true,
        autoIncriment: true
    },
    media_type_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    tableName: 'media_type_master'
});

module.exports = MediaMasterDAO;