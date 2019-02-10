const app = require("../app");


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
        const baseWhere = {
            "where": {

            }
        };

        // Retrieve the parent field from the request,
        // if it has a parent
        if (parentField) {
            baseWhere["where"][parentField] = request.params[parentField];
        }

        // Retrieve the PK from the request
        if (request.params[endpointName]) {
            baseWhere["id"] = request.params[endpointName];
        }

        _buildFiltersWhereRequest(baseWhere, request);
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

    return views;
};
