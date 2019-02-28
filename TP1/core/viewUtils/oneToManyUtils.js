module.exports = function (endpointName, parentField, formFields, filterFields) {
    const builders = {};

    builders.buildFiltersWhereRequest = function(baseWhereObj, request) {
        let filterField;

        for (let i = 0; i < filterFields.length; ++i) {
            filterField = filterFields[i];

            if (request.query[filterField]) {
                baseWhereObj[filterField] = request.query[filterField];
            }
        }

        return baseWhereObj;
    };

    builders.buildWhereRequest = function(request) {
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

        builders.buildFiltersWhereRequest(baseWhere, request);

        return {"where": baseWhere};
    };

    builders.buildForm = function(request, next, validFunc) {
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
            formBody[parentField] = request.params[parentField];
        }

        validFunc(formBody);
    };

    return builders;
};
