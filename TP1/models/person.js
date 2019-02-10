const Sequelize = require('sequelize');
const db = require("../db");

const Person = db.define('Person', {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING
});

module.exports = Person;
