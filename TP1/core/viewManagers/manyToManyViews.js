const app = require("../../app");
require("../../utils/strings");

const HTTP_CONTENT_CREATED_STATUS = 201;
const HTTP_CONTENT_UPDATED_STATUS = 204;

module.exports = function (cfg, builders) {
    const model = cfg.model;
    const base = cfg.bases[0];
    const views = {};

    const capitalizedAssocName = cfg.assocName.capitalize();
    const getterAssoc = "get" + capitalizedAssocName;
    const createAssoc = "add" + capitalizedAssocName;

    views.getIndex = function (request, response, next) {
        app.query(next, base.model.findOne(builders.buildWhereRequest(request)), results => {
            results = results ? results[cfg.assocName] : [];
            response.json(results);
        });
    };

    views.createAssoc = async function (request, response, next) {
        const query = {};
        query[cfg.foreignKey] = request.params[cfg.endpoint];
        query[base.foreignKey] = request.params[cfg.parentFieldName];

        app.query(
            next,
            cfg.assocModel.create(query),
            () => response.status("201").end()
        );
    };

    views.deleteOne = function (request, response, next) {
        app.query(
            next,
            model.destroy(builders.buildWhereRequest(request)),
            results =>  {
                !results
                    ? app.throwNotFound(next)
                    : response.status("204").end();
            }
        );
    };

    return views;
};
