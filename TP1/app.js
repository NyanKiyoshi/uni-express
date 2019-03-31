const errors = require("./errors");
const app = require("express")();
const bodyParser = require('body-parser');

function internalError(next, err) {
    if (err.name === "SequelizeUniqueConstraintError") {
        next({
            status: 400,
            message: errors.ERR_RELATION_EXISTS,
        });
    }
    else {
        next({
            status: 500,
            message: "Something went wrong. " + err
        });
    }
}

function query(next, promise, thenFunc) {
    promise.then(thenFunc).catch(reason => internalError(next, reason));
}

function errorHandler(err, req, res, next) {
    if (err.stack) {
        console.error(err.stack);
        err = {
            status: 500,
            error: err
        }
    }

    // Handle JWT passing an error object into an error object.
    if (err.error) {
        err = err.error;
    }

    res.status(err.status).json({
        error: err
    });
}

function throwNotFound(next) {
    next({
        status: 404,
        message: "No such object."
    });
}

/**
 * Sends a JSON response to an express app with a status code.
 * For some reason, setting a status code sets the content type wrong.
 * @param response
 * @param jsonBody
 * @param status
 */
function sendJsonWithStatus(response, jsonBody, status) {
    response
        .status(status)
        .set('Content-Type', 'application/json')
        .json(jsonBody)
}

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

module.exports = app;
module.exports.query = query;
module.exports.errorHandler = errorHandler;
module.exports.throwNotFound = throwNotFound;
module.exports.sendJsonWithStatus = sendJsonWithStatus;
module.exports.internalError = internalError;
