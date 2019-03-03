const Sequelize = require('sequelize');
const db = require("../db");
const User = require("./User");

const Person = db.define('Person', {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING
});

User.hasMany(Person, {
    as: "persons",
    onDelete: "CASCADE"
});
Person.belongsTo(User, { onDelete: "CASCADE" });

module.exports = Person;
