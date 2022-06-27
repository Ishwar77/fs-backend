const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const uuid = require('uuid-random');
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Address */
const UserRoleMasterDAO = dbInstance.define('UserRoleMaster', {
    user_role_id: {
        type: DataTypes.INTEGER,
        field: 'user_role_id',
        primaryKey: true,
        autoIncriment: true
    },
    role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: true,
        // defaultValue: uuid()
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
    tableName: 'user_role_master'
});

module.exports = UserRoleMasterDAO;