const app = require("./app");
const models = require("./models");

module.exports.requiresValidPerson = function (req, res, next) {
    app.query(next, models.persons.Person.findByPk(req.params.personId), foundPerson => {
        if (!foundPerson) {
            app.throwNotFound(next);
        }
        else {
            next();
        }
    });
};
