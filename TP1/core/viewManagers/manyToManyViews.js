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
        builders.buildForm(request, next, query => {
            app.query(
                next,
                cfg.assocModel.create(query),
                () => response.status("201").end()
            );
        });
    };

    views.deleteOne = function (request, response, next) {
        builders.buildForm(request, next, query => {
            app.query(
                next,
                cfg.assocModel.destroy({ where: query }),
                results =>  {
                    !results
                        ? app.throwNotFound(next)
                        : response.status("204").end();
                }
            );
        });
    };

    return views;
};
