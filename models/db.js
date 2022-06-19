const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
});

sequelize.authenticate()
    .then(() => {
        console.log("Conectou a base de dados!");
    })
    .catch(err => {
        console.error("Nao Conectou a base de dados!", err);
    });

const db = {};
db.sequelize = sequelize; //export the Sequelize instance (actual connection pool)

db.user = require("./user.model.js");
db.houses = require("./houses.model.js");
db.events = require("./events.model.js");
db.rating = require("./rating.model.js");
db.roomType = require("./roomType.model.js");
db.peopleInterested = require("./peopleInterested.model.js");
db.hostApprove = require("./hostApprove.model.js");
db.comments = require("./comments.model.js");
db.adminApprove = require("./adminApprove.model.js");


db.sequelize.sync()
    .then(() => {
        console.log("A base de dados foi sincronizada com sucesso.");
    })
    .catch(e => {
        console.log(e);
    });

module.exports = db;