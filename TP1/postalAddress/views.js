const config = require("../config");
const models = require("./models");

const app = config.app;
const PostalAddress = models.PostalAddress;

function _getWhereParamsFromRequest(request) {
    const personId = request.params.personId;
    const postalAddressId = request.params.postalId;

    const body = {
        where: {
            PersonId: personId
        }
    };

    if (postalAddressId) {
        body["where"]["id"] = postalAddressId;
    }

    if (request.query.type) {
        body["where"]["type"] = request.query.type;
    }

    return body;
}

function _handleForm(request, next, validFunc) {
    const body = {
        address: request.body.postal_address,
        type: request.body.postal_type
    };

    if (!(body.address && body.type)) {
        next({
            status: 400,
            message: "Missing field(s)."
        })
    } else {
        validFunc(body);
    }
}

module.exports.listPostalAddresses = function (request, response, next) {
    app.query(
        next,
        PostalAddress.findAll(_getWhereParamsFromRequest(request)),
        results => {
            response.json(results);
        }
    );
};

module.exports.addNewPostalAddress = function (request, response, next) {
    const personId = request.params.personId;

    _handleForm(request, next, function (body) {
        body["PersonId"] = personId;
        app.query(
            next,
            PostalAddress.create(body),
            results => response.json(results)
        );
    });
};

module.exports.getPostalAddress = function (request, response, next) {
    app.query(
        next,
        PostalAddress.findOne(_getWhereParamsFromRequest(request)),
        results => {
            !results
                ? app.throwNotFound(next)
                : response.json(results);
        }
    );
};

module.exports.updatePostalAddress = function (request, response, next) {
    _handleForm(request, next, function (body) {
        app.query(
            next,

            PostalAddress.update(body, _getWhereParamsFromRequest(request)),

            results => {
                (!(results && results[0]))
                    ? app.throwNotFound(next)
                    : response.status("204").end();
            }
        );
    });
};

module.exports.deletePostalAddress = function (request, response, next) {
    app.query(
        next,
        PostalAddress.destroy(_getWhereParamsFromRequest(request)),
        results => {
            !results
                ? app.throwNotFound(next)
                : response.status("204").end();
        }
    );
};
