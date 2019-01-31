const config = require("./config");
const models = require("./models");
const app = config.app;

const routesPersons = require("./persons/routes");
const routesMailAddresses = require("./mailAddress/routes");

// Define the routes
app.use("/persons", routesPersons);
app.use("/persons", routesMailAddresses);

// Define the error middleware
app.use(app.errorHandler);
