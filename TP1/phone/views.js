const app = require("../app");
const models = require("../models");

const Phone = models.phones.Phone;

function _getWhereParamsFromRequest(request) {
    const personId = request.params.personId;

    const body = {
        where: {
            PersonId: personId
        }
    };

    if (request.params.phoneId) {
        body["where"]["id"] = request.params.phoneId;
    }

    if (request.query.type) {
        body["where"]["type"] = request.query.type;
    }

    return body;
}

function _handleForm(request, next, validFunc) {
    const body = {
        number: request.body.phone_number,
        type: request.body.phone_type
    };

    if (!(body.number && body.type)) {
        next({
            status: 400,
            message: "Missing field(s)."
        })
    } else {
        validFunc(body);
    }
}

module.exports.listPhones = function (request, response, next) {
    app.query(
        next,
        Phone.findAll(_getWhereParamsFromRequest(request)),
        results => {
            response.json(results);
        }
    );
};

module.exports.addNewPhone = function (request, response, next) {
    const personId = request.params.personId;

    _handleForm(request, next, function (body) {
        body["PersonId"] = personId;
        app.query(
            next,
            Phone.create(body),
            results => response.json(results)
        );
    });
};

module.exports.getPhone = function (request, response, next) {
    app.query(
        next,
        Phone.findOne(_getWhereParamsFromRequest(request)),
        results => {
            !results
                ? app.throwNotFound(next)
                : response.json(results);
        }
    );
};

module.exports.updatePhone = function (request, response, next) {
    _handleForm(request, next, function (body) {
        app.query(
            next,

            Phone.update(body, _getWhereParamsFromRequest(request)),

            results => {
                (!(results && results[0]))
                    ? app.throwNotFound(next)
                    : response.status("204").end();
            }
        );
    });
};

module.exports.deletePhone = function (request, response, next) {
    app.query(
        next,
        Phone.destroy(_getWhereParamsFromRequest(request)),
        results => {
            !results
                ? app.throwNotFound(next)
                : response.status("204").end();
        }
    );
};

