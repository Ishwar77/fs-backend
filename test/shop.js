const Helper = require('../app/utils/helper');
const sequlize = Helper.dbInstance;
const DataTypes = require('sequelize').DataTypes;

const Shop = sequlize.define('Shop', {
    title: {
        type: DataTypes.STRING
    }
}, {
    timestamps: false,
    tableName: 'Shop'
});


module.exports = Shop;