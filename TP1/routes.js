const app = require("./app");
const models = require("./models");
const RESTFulManager = require("./core/controller");
const groupsViews = require("./views/groups");
const usersViews = require("./views/users");

// Register REST CRUD for /users/:user/...
app.use("/", RESTFulManager({
    model: models.User,
    endpoint: "users",

    formFields: [
        "username",
        "password"
    ],
    filterFields: [
        "username"
    ],

    viewOverrides: {
        "createOne": () => null
    },

    primaryAdditionalRoutes: [{
        method: "POST",
        path: "signin",
        handler: usersViews.postSignIn
    }, {
        method: "POST",
        path: "signup",
        handler: usersViews.postSignUp
    }],

    // Restrict update and deletion from CRUD to non-logged users
    restrictedPatterns: [{
        methods: ["PUT", "DELETE"],
        lazyPattern: cfg => cfg.primaryEndpoint
    }]
}));

// Register REST CRUD for /persons/:person/...
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

// Register REST CRUD for /persons/:person/mailAddresses/:mail/...
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
    ],

    // Those endpoints are already restricted by the 'Person' parent
    restrictedPatterns: []
}));

// Register REST CRUD for /persons/:person/phones/:phone/...
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
    ],

    // Those endpoints are already restricted by the 'Person' parent
    restrictedPatterns: []
}));

// Register REST CRUD for /persons/:person/postalAddresses/:postalAddr/...
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
    ],

    // Those endpoints are already restricted by the 'Person' parent
    restrictedPatterns: []
}));

// Register REST CRUD for /persons/:person/groups/:group/...
app.use("/", RESTFulManager({
    model: models.Group,
    endpoint: "groups",
    assocName: "groups",
    assocModel: models.PersonHasGroup,
    foreignKey: "groupId",

    is_many_to_many: true,

    bases: [{
        "pointName": "persons",
        "model": models.Person,
        "fieldName": "personId",
        "foreignKey": "personId",
    }],

    formFields: [
        "type",
        "address"
    ],
    filterFields: [
        "type"
    ],

    // Those endpoints are already restricted by the 'Person' parent
    restrictedPatterns: []
}));

// Register REST CRUD for /groups/:group/...
app.use("/", RESTFulManager({
    model: models.Group,
    endpoint: "groups",

    formFields: [
        "title"
    ],
    filterFields: [
        "title"
    ],

    secondaryAdditionalRoutes: [{
        method: "GET",
        path: "persons",
        handler: groupsViews.getGroupPersons
    }]
}));

// Define the error middleware
app.use(app.errorHandler);
