const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const dbInstance = Helper.dbInstance;

/** Sequelize DAO Model, for Address */
const AddressDAO = dbInstance.define('Address', {
    address_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        field: 'address_id',
        autoIncriment: true
    },
    place: {
        type: DataTypes.STRING,
        allowNull: false
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false
    },
    country: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pin_code: {
        type: DataTypes.INTEGER,
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
    tableName: 'address'
});

// User depends on Address
AddressDAO.associate = models => {
    AddressDAO.belongsTo(models.User, {
        foreignKey: 'address_id',
        targetKey: 'address_id'
    });
};


module.exports = AddressDAO;