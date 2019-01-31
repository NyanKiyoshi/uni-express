const config = require("./config");
const models = require("./models");
const app = config.app;

const routesPersons = require("./persons/routes");

app.use("/persons", routesPersons);
