const config = require("../config");
const models = require("../models");
const app = config.app;
const Person = models.persons.Person;

function _parseBody(body, next) {
    const query = {
        firstname: body.firstname,
        lastname: body.lastname
    };

    if (!(query.firstname && query.lastname)) {
        return [
            null, "Body is missing some parameter(s)."
        ]
    }

    return [query, null]
}

module.exports.index = function (request, response) {
    app.query(response, Person.all(), persons => {
        response.json(persons);
    })
};

module.exports.createPerson = function (request, response, next) {
    const [query, error] = _parseBody(request.body, next);

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
    const personId = request.params.personId;
    return {
        where: {
            id: personId
        }
    }
}

function _usePersonFromRequest(request, response, next, queryMethod) {
    app.query(
        next,
        queryMethod(_getPersonQueryFromRequest(request)),
        results => {
            if (results) {
                response.send(results);
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
    const [query, error] = _parseBody(request.body, next);

    if (error) {
        next({
            status: 400,
            message: error
        });
    }
    else {
        _usePersonFromRequest(
            request, response, next,
            params => {
                return Person.update(query, params).then(
                    _ => Person.findOne(params));
            });
    }
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
