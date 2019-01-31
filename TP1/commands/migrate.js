const config = require("../config");
const models = require("../models");

config.db.sync().then(value => {
    return models.persons.Person.create({
        firstname: "John",
        lastname: "Doe"
    });
}).catch(
    reason => console.error(reason));
