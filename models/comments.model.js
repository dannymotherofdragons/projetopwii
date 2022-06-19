const {Sequelize, Model, DataTypes} = require('sequelize');
const db = require('./db.js');

const sequelize = new Sequelize.Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT
})

class Comments extends Model { }

Comments.init({
    userID: DataTypes.INTEGER,
    postID: DataTypes.INTEGER,
    content: DataTypes.STRING
}, { sequelize, timestamps: false, modelName: 'comments' })

sequelize.sync().then().catch(error => {
    console.log(error);
})

exports.Comments = Comments;