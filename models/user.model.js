const { Sequelize, Model, DataTypes } = require('sequelize');
const db = require('./db.js');
const { Houses } = require('./houses.model.js');
const { Events } = require('./events.model.js');
const { Comments } = require('./comments.model.js');
const { Ratings } = require('./rating.model.js');
const { peopleInteresteds } = require('./peopleInterested.model.js');
const { hostApproves } = require('./hostApprove.model.js');

const sequelize = new Sequelize.Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

class Users extends Model { }

Users.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    userType: {
        type: DataTypes.ENUM('admin', 'regular', 'host'),
        defaultValue: 'regular',
        validate: {
            isIn: {
                args: [['admin', 'regular', 'host']],
                msg: "Allowed roles: admin, regular or host"
            }
        }
    },
    is_blocked: DataTypes.BOOLEAN
}, { sequelize, timestamps: false, modelName: 'users' })

Users.hasMany(Houses, { foreignKey: 'id_users' })
Houses.belongsTo(Users, { foreignKey: 'id_users' })

Users.hasMany(Events, { foreignKey: 'id_users' })
Events.belongsTo(Users, { foreignKey: 'id_users' })

Users.hasMany(Comments, { foreignKey: 'id_users' })
Comments.belongsTo(Users, { foreignKey: 'id_users' })

Users.hasMany(Ratings, { foreignKey: 'id_users' })
Ratings.belongsTo(Users, { foreignKey: 'id_users' })

Users.hasMany(peopleInteresteds, { foreignKey: 'id_users' })
peopleInteresteds.belongsTo(Users, { foreignKey: 'id_users' })

Users.hasMany(hostApproves, { foreignKey: 'id_users' })
hostApproves.belongsTo(Users, { foreignKey: 'id_users' })

sequelize.sync().then().catch(error => {
    console.log(error);
})

exports.Users = Users;