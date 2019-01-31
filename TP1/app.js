const app = require("express")();
const bodyParser = require('body-parser');

function query(next, promise, thenFunc) {
    promise.then(thenFunc).catch(reason => {
        next({
            status: 500,
            message: "Something went wrong. " + reason
        });
    });
}

function errorHandler(err, req, res, next) {
    res.status(err.status).json({
        error: err
    });
}

app.use(bodyParser.json());

module.exports = app;
module.exports.query = query;
module.exports.errorHandler = errorHandler;
