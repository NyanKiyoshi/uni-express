const Sequelize = require('sequelize');
const db = require("../db");
const Person = require("../persons/models").Person;

const MailAddress = db.define("MailAddress", {
    type: {
        type: Sequelize.ENUM("home", "work"),
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    }
});

Person.hasMany(MailAddress, {as: "mailAddresses"});

module.exports.MailAddress = MailAddress;
