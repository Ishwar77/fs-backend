const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Invoice */
const InvoiceDAO = dbInstance.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncriment: true
    },
    invoice_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_email_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    invoice_data: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    invoice_status: {
        type: DataTypes.STRING,
        allowNull: true,
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
    }
}, 
{
    timestamps: false,
    tableName: 'invoice'
});

module.exports = InvoiceDAO;