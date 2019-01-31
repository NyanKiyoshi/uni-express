const config = require("./config");
const _ = require("./routes");

config.app.listen(5000, () => console.log(
    "Started server on http://127.0.0.1:5000/..."));
