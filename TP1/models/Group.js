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
        allowNull: false,
        unique: true
    }
});

Person.belongsToMany(Group, {
    through: Group
});
Group.belongsToMany(Person, {
    through: Group
});

module.exports = Group;
