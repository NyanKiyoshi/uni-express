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
    if (err.stack) {
        console.error(err.stack);
        err = {
            status: 500,
            error: err
        }
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

module.exports = app;
module.exports.query = query;
module.exports.errorHandler = errorHandler;
module.exports.throwNotFound = throwNotFound;
module.exports.sendJsonWithStatus = sendJsonWithStatus;
