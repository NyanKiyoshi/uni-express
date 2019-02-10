const config = require("../config");
const models = require("../models");
const app = config.app;
const Person = models.persons.Person;

function _parseBody(request, next) {
    const query = {
        firstname: request.body.firstname,
        lastname: request.body.lastname
    };

    if (!(query.firstname && query.lastname)) {
        return [
            null, "Body is missing some parameter(s)."
        ]
    }

    return [query, null]
}

function _handleForm(request, next, validFunc) {
    const body = {
        firstname: request.body.firstname,
        lastname: request.body.lastname
    };

    if (!(body.firstname && body.lastname)) {
        next({
            status: 400,
            message: "Missing field(s)."
        })
    } else {
        validFunc(body);
    }
}

module.exports.index = function (request, response) {
    let query = {
        "where": {
        }
    };
    if (request.query.lastname) {
        query["where"]["lastname"] = request.query.lastname;
    }

    app.query(response, Person.findAll(query), persons => {
        response.json(persons);
    })
};

module.exports.createPerson = function (request, response, next) {
    const [query, error] = _parseBody(request, next);

    if (error) {
        next({
            status: 400,
            message: error
        });
    }
    else {
        app.query(
            next,
            Person.create(query),
            newPerson => response.status(201).send(newPerson)
        );
    }
};

function _getPersonQueryFromRequest(request) {
    return {
        where: {
            id: request.params.personId
        }
    };
}

function _usePersonFromRequest(request, response, next, queryMethod) {
    app.query(
        next,
        queryMethod(_getPersonQueryFromRequest(request)),
        results => {
            if (results || (results.length > 0 && results[0])) {
                response.json(results);
            }
            else {
                app.throwNotFound(next);
            }
        }
    );
}

module.exports.getPerson = function (request, response, next) {
    _usePersonFromRequest(
        request, response, next,
        params => Person.findOne(params));
};

module.exports.updatePerson = function (request, response, next) {
    _handleForm(request, next, function (body) {
        app.query(
            next,

            Person.update(body, _getPersonQueryFromRequest(request)),

            results => {
                (!(results && results[0]))
                    ? app.throwNotFound(next)
                    : response.status("204").end();
            }
        );
    });
};

module.exports.deletePerson = function (request, response, next) {
    app.query(
        next,
        Person.destroy(_getPersonQueryFromRequest(request)),
        results => {
            if (!results) {
                app.throwNotFound(next);
            } else {
                response.status("204").send("");
            }
        }
    );
};
