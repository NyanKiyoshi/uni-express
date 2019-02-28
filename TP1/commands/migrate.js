const db = require("../db");
const models = require("../models");

db.sync({ force: true }).then(value => {
    models.Person.create({
        firstname: "John",
        lastname: "Doe"
    });
    models.Group.create({
        title: "Dummy Group"
    })
}).catch(
    reason => console.error(reason));
