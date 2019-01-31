const config = require("./config");
const models = require("./models");
const app = config.app;

const routesPersons = require("./persons/routes");

// Define the routes
app.use("/persons", routesPersons);

// Define the error middleware
app.use(app.errorHandler);
