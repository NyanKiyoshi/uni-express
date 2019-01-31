const config = require("../config");
const models = require("../models");
const app = config.app;

module.exports.index = function (request, response) {
    app.query(response, models.persons.Person.all(), persons => {
        response.json(persons);
    })
};
