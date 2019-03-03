const Sequelize = require('sequelize');
const bcrypt = require("bcrypt");
const db = require("../db");

const User = db.define('User', {
        username: {
            type: Sequelize.STRING,
            unique: true
        },
        password_hash: Sequelize.STRING,
        password: {
            type: Sequelize.VIRTUAL,
            set: function (password) {
                // Remember to set the data value, otherwise it won't be validated
                this.setDataValue(
                    'password', password
                );
                this.setDataValue(
                    'password_hash', bcrypt.hashSync(password, bcrypt.genSaltSync(8))
                );
            }
        }
    },
    {
        freezeTableName: true,
        instanceMethods: {
            validPassword(passwordHash) {
                return bcrypt.compare(passwordHash, this.password_hash);
            }
        }
    }
);

User.prototype.toJSON =  function () {
    let values = Object.assign({}, this.get());

    delete values.password_hash;
    return values;
};

module.exports = User;
