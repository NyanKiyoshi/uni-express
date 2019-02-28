const db = require("../db");
const models = require("../models");

db.sync({ force: true }).then(async value => {
    const person = await models.Person.create({
        firstname: "John",
        lastname: "Doe"
    });
    const person2 = await models.Person.create({
        firstname: "Me",
        lastname: "Too"
    });

    const group = await models.Group.create({
        title: "Dummy Group"
    });

    person.setGroups([group]).error(err => {
        console.log(err)
    });
}).catch(
    reason => console.error(reason));
