const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;
const UserDao = require('../user-module/user.dao');


/** Sequelize DAO Model, for Address */
const AuthenticationDAO = dbInstance.define('Authentication', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'id',
        autoIncriment: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        foreignKey: true,
        field: 'user_id',
        references: {
            model: UserDao, // TODO Create User Table
            key: 'user_id'
      }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salt: {
        type: DataTypes.TEXT,
        allowNull: false
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
        allowNull: true
    },
}, {
    timestamps: false,
    tableName: 'authentication'
});

module.exports = AuthenticationDAO;