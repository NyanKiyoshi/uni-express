const app = require("./app");
const models = require("./models");
const RESTFulManager = require("./core/controller");

app.use("/", RESTFulManager(
    // Model
    models.Person,

    // Endpoint
    "persons",

    // Bases
    {},

    // Fields
    ["firstname", "lastname"],

    // Searchable fields
    ["lastname"]));

app.use("/", RESTFulManager(
    // Model
    models.MailAddress,

    // Endpoint
    "mailAddresses",

    // Bases
    [{
        "pointName": "persons",
        "model": models.Person,
        "fieldName": "PersonId"
    }],

    // Fields
    ["type", "address"],

    // Searchable fields
    ["type"]));

app.use("/", RESTFulManager(
    // Model
    models.Phone,

    // Endpoint
    "phones",

    // Bases
    [{
        "pointName": "persons",
        "model": models.Person,
        "fieldName": "PersonId"
    }],

    // Fields
    ["type", "number"],

    // Searchable fields
    ["type"]));

app.use("/", RESTFulManager(
    // Model
    models.PostalAddress,

    // Endpoint
    "postalAddresses",

    // Bases
    [{
        "pointName": "persons",
        "model": models.Person,
        "fieldName": "PersonId"
    }],

    // Fields
    ["type", "address"],

    // Searchable fields
    ["type"]));

// Define the error middleware
app.use(app.errorHandler);
