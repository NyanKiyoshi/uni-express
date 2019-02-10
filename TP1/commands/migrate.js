const db = require("../db");
const models = require("../models");

db.sync().then(value => {
    models.Person.create({
        firstname: "John",
        lastname: "Doe"
    });
}).catch(
    reason => console.error(reason));
