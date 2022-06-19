const {Sequelize, Model, DataTypes} = require('sequelize');
const db = require('./db.js');

const sequelize = new Sequelize.Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

class roomTypes extends Model { }

roomTypes.init({
    type: DataTypes.STRING
}, {sequelize, timestamps: false, modelName: 'roomTypes'})




sequelize.sync().then().catch(error => {
    console.log(error);
})

exports.roomTypes = roomTypes;