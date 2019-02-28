const app = require("./app");
const models = require("./models");
const RESTFulManager = require("./core/controller");

app.use("/", RESTFulManager({
    model: models.Person,
    endpoint: "persons",

    formFields: [
        "firstname",
        "lastname"
    ],
    filterFields: [
        "lastname"
    ]
}));

app.use("/", RESTFulManager({
    model: models.MailAddress,
    endpoint: "mailAddresses",

    bases: [{
        "pointName": "persons",
        "model": models.Person,
        "fieldName": "PersonId"
    }],

    formFields: [
        "type",
        "address"
    ],
    filterFields: [
        "type"
    ]
}));

app.use("/", RESTFulManager({
    model: models.Phone,
    endpoint: "phones",

    bases: [{
        "pointName": "persons",
        "model": models.Person,
        "fieldName": "PersonId"
    }],

    formFields: [
        "type",
        "number"
    ],
    filterFields: [
        "type"
    ]
}));

app.use("/", RESTFulManager({
    model: models.PostalAddress,
    endpoint: "postalAddresses",

    bases: [{
        "pointName": "persons",
        "model": models.Person,
        "fieldName": "PersonId"
    }],

    formFields: [
        "type",
        "address"
    ],
    filterFields: [
        "type"
    ]
}));

app.use("/", RESTFulManager({
    model: models.Group,
    endpoint: "groups",

    formFields: [
        "title"
    ],
    filterFields: [
        "title"
    ]
}));

// Define the error middleware
app.use(app.errorHandler);
