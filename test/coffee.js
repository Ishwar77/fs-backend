const Helper = require('../app/utils/helper');
const sequlize = Helper.dbInstance;
const DataTypes = require('sequelize').DataTypes;

const Coffee = sequlize.define('Coffee', {
    title: {
        type: DataTypes.STRING
    },
    shopId: {
        type: DataTypes.INTEGER,
        foreignKey: true
    }
}, {
    timestamps: false,
    tableName: 'Coffee'
});




module.exports = Coffee;