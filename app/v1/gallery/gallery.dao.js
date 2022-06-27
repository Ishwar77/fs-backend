const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const EventDAO = require('../events-module/event.dao');
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Address */
const GalleryDAO = dbInstance.define('Gallery', {
    gallery_id: {
        type: DataTypes.INTEGER,
        field: 'gallery_id',
        primaryKey: true,
        autoIncriment: true
    },
    event_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
        field: 'event_id',
        references: {
            model: EventDAO,
            key: 'event_id'
        }
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
    tableName: 'gallery'
});

module.exports = GalleryDAO;