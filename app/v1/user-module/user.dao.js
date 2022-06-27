const Helper = require('../../utils/helper');
const { DataTypes } = require('sequelize');
const AddressDAO = require("../address-module/address.dao");
const UserRoleMasterDAO = require("../user-role-master/user-role-master.dao");
const uuid = require('uuid-random');
const dbInstance = Helper.dbInstance;


/** Sequelize DAO Model, for Address */
const UserDAO = dbInstance.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        primaryKey: true,
        autoIncriment: true
    },
    user_role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        foreignKey: true,
        field: 'user_role_id',
        references: {
            model: UserRoleMasterDAO,
            key: 'user_role_id'
        }
    },
    address_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        foreignKey: true,
        field: 'address_id',
        references: {
            model: AddressDAO,
            key: 'address_id'
        }
    },
    diaplay_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    pageName: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    experience: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mobile_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    profile_picture_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    referral_code: {
        type: DataTypes.STRING,
        allowNull: true,
        false: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'N/A'
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    expertise_in: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    uuid: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: uuid()
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
        allowNull: true
        // ,
        // defaultValue: 1
    },
}, {
    timestamps: false,
    tableName: 'user'
});

UserDAO.associate = models => {
    UserDAO.hasOne(models.Address, {
        foreignKey: 'address_id',
        sourceKey: 'address_id'
    });
};


module.exports = UserDAO;