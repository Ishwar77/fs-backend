const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const AddressDAO = require('../address-module/address.dao');
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Fitness Center */
const FitnessCenterDAO = dbInstance.define('FitnessCenter', {
    center_id: {
        type: DataTypes.INTEGER,
        field: 'center_id',
        primaryKey: true,
        autoIncriment: true
    },
    place_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'place_id',
        references: {
            model: AddressDAO,
            key: 'address_id'
        }
    },
    center_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    email_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    social_links: {
        type: DataTypes.STRING,
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
        allowNull: true,
        defaultValue: 1
    },
}, {
    timestamps: false,
    tableName: 'fitness_center'
});

module.exports = FitnessCenterDAO;