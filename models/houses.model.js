const {Sequelize, Model, DataTypes} = require('sequelize');
const db = require('./db.js');
const { roomTypes } = require('./roomType.model.js');
const { Ratings } = require('./rating.model.js');
const { Comments } = require('./comments.model.js');
const { hostApproves } = require('./hostApprove.model');

const sequelize = new Sequelize.Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

class Houses extends Model { }

Houses.init({
    host_id: DataTypes.INTEGER,
    location: DataTypes.STRING,
    availabilty: DataTypes.BOOLEAN,
    description: DataTypes.STRING,
    price_tag: DataTypes.FLOAT,
    rooms: DataTypes.INTEGER,
    room_type: DataTypes.STRING,
    isApproved: DataTypes.BOOLEAN
}, { sequelize, timestamps: false, modelName: 'houses'})

Houses.hasOne(roomTypes, { foreignKey: 'id_houses'})
roomTypes.belongsTo(Houses, { foreignKey: 'id_houses'})

Houses.hasMany(Ratings, { foreignKey: 'id_houses' })
Ratings.belongsTo(Houses, { foreignKey: 'id_houses' })

Houses.hasMany(Comments, { foreignKey: 'id_houses' })
Comments.belongsTo(Houses, { foreignKey: 'id_houses' })

Houses.hasMany(hostApproves, { foreignKey: 'id_houses'})
hostApproves.belongsTo(Houses, { foreignKey: 'id_houses'})

sequelize.sync().then().catch(error => {
    console.log(error);
})

exports.Houses = Houses;