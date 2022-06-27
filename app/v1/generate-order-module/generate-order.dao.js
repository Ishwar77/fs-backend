const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Generating Orders */
const GenerateOrderDAO = dbInstance.define('GenerateOrder', {
    order_gen_id: {
        type: DataTypes.INTEGER,
        field: 'order_gen_id',
        primaryKey: true,
        autoIncriment: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    reciptId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.JSON,
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
        defaultValue: DataTypes.NOW
    },    
}, 
{
        timestamps: false,
        tableName: 'orders_generated'
});

module.exports = GenerateOrderDAO;