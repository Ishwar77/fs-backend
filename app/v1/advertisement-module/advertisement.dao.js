const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Advertisement */
const AdvertisementDAO = dbInstance.define('Advertisement', {
    advertisement_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'advertisement_id',
        autoIncriment: true
    },
    advertisement_title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    advertisement_description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    advertisement_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    advertisement_start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    advertisement_end_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    advertisement_spot: {
        type: DataTypes.STRING,
        allowNull: true
    },
    trainer_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    amount_paid: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    addvertising_days: {
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
    tableName: 'advertisement'
});

module.exports = AdvertisementDAO;