const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const MediaTypeMasterDAO = require('../media-type-master-module/mediamaster.dao');
const GalleryDAO = require('../gallery/gallery.dao');
const dbInstance = Helper.dbInstance;



/** Sequelize DAO Model, for Address */
const GalleryItemDAO = dbInstance.define('GalleryItem', {
    gallery_item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'gallery_item_id',
        autoIncriment: true
    },
    gallery_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'gallery_id',
        references: {
            model: GalleryDAO,
            key: 'gallery_id'
        }
    },
    media_type_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
        field: 'media_type_id',
        references: {
            model: MediaTypeMasterDAO,
            key: 'media_type_id'
        }
    },
    media_path: {
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
    tableName: 'gallery_items'
});

module.exports = GalleryItemDAO;