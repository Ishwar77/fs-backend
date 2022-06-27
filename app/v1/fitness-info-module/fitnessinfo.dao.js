const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;
const UserDao = require('../user-module/user.dao');


/** Sequelize DAO Model, for Fitness Info */
const FitnessInfoDAO = dbInstance.define('FitnessInfo', {
    fitness_info_id: {
        type: DataTypes.INTEGER,
        field: 'fitness_info_id',
        primaryKey: true,
        autoIncriment: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'user_id',
        references: {
            model: UserDao,
            key: 'user_id'
        }
    },
    height: {
        type: DataTypes.STRING,
        allowNull: false
    },
    weight: {
        type: DataTypes.STRING,
        allowNull: false
    },
    BMI: {
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
    tableName: 'fitness_info'
});

module.exports = FitnessInfoDAO;