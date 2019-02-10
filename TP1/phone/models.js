const Sequelize = require('sequelize');
const db = require("../db");
const Person = require("../persons/models").Person;

const Phone = db.define("Phone", {
    type: {
        type: Sequelize.ENUM("home", "work"),
        allowNull: false
    },
    number: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Person.hasMany(Phone, {as: "phones", onDelete: "CASCADE"});
Phone.belongsTo(Person, { onDelete: 'CASCADE' });

module.exports.Phone = Phone;
