const {Sequelize, Model, DataTypes} = require('sequelize');
const db = require('./db.js');

const sequelize = new Sequelize.Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

class Ratings extends Model { }

Ratings.init({
    rating: DataTypes.FLOAT,
    comment: DataTypes.STRING
}, {sequelize, timestamps: false, modelName: 'ratings'})

sequelize.sync().then().catch(error => {
    console.log(error);
})

exports.Ratings = Ratings;