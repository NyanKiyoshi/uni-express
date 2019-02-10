const Sequelize = require('sequelize');
const db = require("../db");
const Person = require("./Person");

const PostalAddress = db.define("PostalAddress", {
    type: {
        type: Sequelize.ENUM("home", "work"),
        allowNull: false
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Person.hasMany(PostalAddress, {as: "postalAddresses", onDelete: "CASCADE"});
PostalAddress.belongsTo(Person, { onDelete: 'CASCADE' });

module.exports = PostalAddress;
