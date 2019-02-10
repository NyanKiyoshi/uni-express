const app = require("../app");
const utils = require("./utils");

const HTTP_CONTENT_CREATED_STATUS = 201;
const HTTP_CONTENT_UPDATED_STATUS = 204;


module.exports = function (model, endpointName, parentField, formFields, filterFields) {
    const views = {};

    function _buildFiltersWhereRequest(baseWhereObj, request) {
        let filterField;

        for (let i = 0; i < filterFields.length; ++i) {
            filterField = filterFields[i];

            if (request.query[filterField]) {
                baseWhereObj[filterField] = request.query[filterField];
            }
        }
    }

    function _buildWhereRequest(request) {
        const baseWhere = {};

        // Retrieve the parent field from the request,
        // if it has a parent
        if (parentField) {
            baseWhere[parentField] = request.params[parentField];
        }

        // Retrieve the PK from the request
        if (request.params[endpointName]) {
            baseWhere["id"] = request.params[endpointName];
        }

        _buildFiltersWhereRequest(baseWhere, request);

        return {"where": baseWhere};
    }

    function _buildForm(request, next, validFunc) {
        const formBody = {};

        let formField, value;
        for (let i = 0; i < formFields.length; ++i) {
            formField = formFields[i];
            value = formBody[formField] = request.body[formField];

            if (!value) {
                next({
                    status: 400,
                    message: "Missing field: " + formField
                })
            }
        }

        // If the model has a parent,
        // we set the children to be parent of it
        if (parentField) {
            formBody[parentField] = request.arguments[parentField];
        }

        validFunc(formBody);
    }

    views.getIndex = function (request, response, next) {
        app.query(next, model.findAll(_buildWhereRequest(request)), results => {
            response.json(results);
        });
    };

    views.getOne = function (request, response, next) {
        app.query(next, model.findOne(_buildWhereRequest(request)),
            results => {
                !results
                    ? app.throwNotFound(next)
                    : response.json(results);
            }
        );
    };

    views.createOne = function (request, response, next) {
        _buildForm(request, next, function (body) {
            app.query(
                next,
                model.create(body),
                results => app.sendJsonWithStatus(response, results, 201)
            );
        });
    };

    views.updateOne = function (request, response, next) {
        _buildForm(request, next, function (body) {
            app.query(
                next,
                model.update(body, _buildWhereRequest(request)),
                results =>  {
                    (!(results && results[0]))
                        ? app.throwNotFound(next)
                        : response.status("204").end();
                }
            );
        });
    };

    views.deleteOne = function (request, response, next) {
        app.query(
            next,
            model.destroy(_buildWhereRequest(request)),
            results =>  {
                !results
                    ? app.throwNotFound(next)
                    : response.status("204").end();
            }
        );
    };

    return views;
};
