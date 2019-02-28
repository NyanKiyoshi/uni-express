const Sequelize = require('sequelize');
const db = require("../db");
const Person = require("./Person");

const Group = db.define("Group", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    }
});

module.exports = Group;
