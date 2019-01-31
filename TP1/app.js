const app = require("express")();

function query(response, promise, thenFunc) {
    promise.then(thenFunc).catch(reason => {
        response.status(500);
        response.send("Something went wrong. " + reason);
    });
}

module.exports = app;
module.exports.query = query;
