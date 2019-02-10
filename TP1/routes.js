const app = require("./app");
const models = require("./models");
const middlewares = require("./middlewares");

const routesPersons = require("./persons/routes");
const routesMailAddresses = require("./mailAddress/routes");
const routesMailPhones = require("./phone/routes");
const routesMailPostals = require("./postalAddress/routes");

// Implement middlewares before URLs
app.use("/persons/:personId/", middlewares.requiresValidPerson);

// Define the routes
app.use("/persons", routesPersons);
app.use("/persons", routesMailAddresses);
app.use("/persons", routesMailPhones);
app.use("/persons", routesMailPostals);

// Define the error middleware
app.use(app.errorHandler);
