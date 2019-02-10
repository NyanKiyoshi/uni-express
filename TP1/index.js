const http = require("http");
const app = require("./app");
const config = require("./config");
const _ = require("./routes");

app.listen(
    config.HTTP_LISTEN_PORT,
    () => console.log(
        "Started server on http://%s:%d...",
        config.HTTP_LISTEN_HOST, config.HTTP_LISTEN_PORT));
