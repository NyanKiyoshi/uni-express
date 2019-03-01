module.exports = function (bases, cfg) {
    const builders = bases;

    builders.buildWhereRequest = function(request) {
        const baseWhere = {};

        // Retrieve the PK from the request
        baseWhere["id"] = request.params[cfg.bases[0].fieldName];

        // Add the filters
        builders.buildFiltersWhereRequest(baseWhere, request);

        return {
            "where": baseWhere,
            "include": [{
                model: cfg.model,
                as: cfg.assocName
            }]
        };
    };

    builders.buildForm = function(request, next, validFunc) {
        const query = {};
        query[cfg.foreignKey] = request.params[cfg.endpoint];
        query[cfg.bases[0].foreignKey] = request.params[cfg.parentFieldName];

        validFunc(query);
    };

    return builders;
};
