const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, 'test.env')
});

const lazyExports = {
    jwt: {}
};

beforeEach(async function () {
    const jwt = require("./internal/jwtTesting");
    const db = require("../db");
    const models = require("../models");

    lazyExports.jwt = jwt;

    await db.sync({ force: true }).then(async value => {
        await models.User.create({
            id: 1,
            username: "admin",
            password: "admin123"
        });
        await models.User.create({
            id: 2,
            username: "user123",
            password: "user456"
        });

        const personWithoutGroup = await models.Person.create({
            id: 1,
            firstname: "John",
            lastname: "Doe"
        });
        const personWithGroup = await models.Person.create({
            id: 2,
            firstname: "Miss",
            lastname: "Da Two"
        });

        models.Phone.create({
            id: 1,
            type: "work",
            number: "+33 6 00 00 00",
            PersonId: 2
        });

        models.PostalAddress.create({
            id: 1,
            type: "work",
            address: "3 rue",
            PersonId: 2
        });

        models.MailAddress.create({
            id: 1,
            type: "work",
            address: "miss@example.com",
            PersonId: 2
        });

        const groupWithPersons = await models.Group.create({
            id: 1,
            title: "group_1"
        });

        const emptyGroup = await models.Group.create({
            id: 2,
            title: "group_2"
        });

        await groupWithPersons.addPerson(personWithGroup);
        await jwt.getAccessToken();
    });

});

module.exports = lazyExports;
