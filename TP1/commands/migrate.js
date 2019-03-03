const db = require("../db");
const models = require("../models");

db.sync({ force: true }).then(async value => {
    const user = await models.User.create({
        username: "admin",
        password: "admin"
    });

    const person = await user.createPerson({
        firstname: "John",
        lastname: "Doe"
    });

    const person2 = await user.createPerson({
        firstname: "Me",
        lastname: "Too"
    });

    const group = await person.createGroup({
        title: "Dummy Group"
    });
    const emptyGroup = person.createGroup({
        title: "Another Group"
    });
}).catch(
    reason => console.error(reason));
