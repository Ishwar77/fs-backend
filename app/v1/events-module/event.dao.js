const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const EventMasterDAO = require('../event-master-module/eventmaster.dao');
const GalleryDAO = require('../gallery/gallery.dao');
const InstructorDAO = require('../user-module/user.dao');
const dbInstance = Helper.dbInstance;



/** Sequelize DAO Model, for Address */
const EventDAO = dbInstance.define('Event', {
    event_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'event_id',
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
    event_master_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: false,
        field: 'event_master_id',
        references: {
            model: EventMasterDAO,
            key: 'event_master_id'
        }
    },
    event_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    cover_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    is_repetitive: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    repeat_every: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    start_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    end_time: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    trial_period: {
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
    instructor_id: {
        type: DataTypes.INTEGER,
        foreignKey: true,
        allowNull: true,
        field: 'instructor_id',
        references: {
            model: InstructorDAO,
            key: 'user_id'
        }
    }
}, 
{
    timestamps: false,
    tableName: 'event'
});

module.exports = EventDAO;