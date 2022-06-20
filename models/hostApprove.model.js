const {Sequelize, Model, DataTypes} = require('sequelize');
const db = require('./db.js');

const sequelize = new Sequelize.Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

class hostApproves extends Model { }

hostApproves.init({
    approve: DataTypes.BOOLEAN
}, { sequelize, timestamps: false, modelName: 'hostApproves'})

sequelize.sync().then().catch(error => {
    console.log(error);
})

exports.hostApproves = hostApproves;