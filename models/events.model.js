const {Sequelize, Model, DataTypes} = require('sequelize');
const db = require('./db.js');
const { peopleInteresteds } = require('./peopleInterested.model.js');
const { Comments } = require('./comments.model.js');

const sequelize = new Sequelize.Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

class Events extends Model { }

Events.init({
    location: DataTypes.STRING,
    date: DataTypes.DATE,
    eventType: DataTypes.INTEGER,
    isApproved: DataTypes.BOOLEAN
}, { sequelize, timestamps: false, modelName: 'events'})

Events.hasMany(peopleInteresteds, { foreignKey: 'id_events' })
peopleInteresteds.belongsTo(Events, { foreignKey: 'id_events' })

Events.hasMany(Comments, { foreignKey: 'id_events' })
Comments.belongsTo(Events, { foreignKey: 'id_events' })

sequelize.sync().then().catch(error => {
    console.log(error);
})

exports.Events = Events;