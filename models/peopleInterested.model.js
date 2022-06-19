const {Sequelize, Model, DataTypes} = require('sequelize');
const db = require('./db.js');

const sequelize = new Sequelize.Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

class peopleInteresteds extends Model { }

peopleInteresteds.init({
}, { sequelize, timestamps: false, modelName: 'peopleInteresteds'})

sequelize.sync().then().catch(error => {
    console.log(error);
})

exports.peopleInteresteds = peopleInteresteds;