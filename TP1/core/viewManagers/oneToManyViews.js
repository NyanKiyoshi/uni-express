const app = require("../../app");

const HTTP_CONTENT_CREATED_STATUS = 201;
const HTTP_CONTENT_UPDATED_STATUS = 204;

module.exports = function (cfg, builders) {
    const model = cfg.model;
    const views = {};

    views.getIndex = function (request, response, next) {
        app.query(next, model.findAll(builders.buildWhereRequest(request)), results => {
            response.json(results);
        });
    };

    views.getOne = function (request, response, next) {
        app.query(next, model.findOne(builders.buildWhereRequest(request)),
            results => {
                !results
                    ? app.throwNotFound(next)
                    : response.json(results);
            }
        );
    };

    views.createOne = function (request, response, next) {
        builders.buildForm(request, next, function (body) {
            app.query(
                next,
                model.create(body),
                results => app.sendJsonWithStatus(response, results, 201)
            );
        });
    };

    views.updateOne = function (request, response, next) {
        builders.buildForm(request, next, function (body) {
            app.query(
                next,
                model.update(body, builders.buildWhereRequest(request)),
                results =>  {
                    (!(results && results[0]))
                        ? app.throwNotFound(next)
                        : app.query(
                            next, model.findOne(builders.buildWhereRequest(request)),
                            payload => response.json(payload)
                        );
                }
            );
        });
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
