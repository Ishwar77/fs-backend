const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');

const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Contact Us */
const ContactUsDAO = dbInstance.define('Contact Us', {
    contact_id: {
        type: DataTypes.INTEGER,
        field: 'contact_id',
        primaryKey: true,
        autoIncriment: true
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
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
    tableName: 'contactus'
});

module.exports = ContactUsDAO;