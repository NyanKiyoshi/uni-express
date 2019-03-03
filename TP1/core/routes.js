const express = require("express");
const middlewares = require("./middlewares");
const utils = require("./utils");
const sprintf = require("sprintf-js").sprintf;

const REQUIRED_ROUTE_FIELDS = [
    "path", "method", "handler"
];

function registerHandler(router, method, path, handler) {
    if (handler) {
        router[method](path, handler)
    }
}

function registerRoutes(router, viewBuilderUtils, routePrefix, newRoutes) {
    let handler;
    let meth;

    newRoutes.forEach(function (specs) {
        // Ensure the route is correctly set-up
        utils.assertAllFields(
            specs, REQUIRED_ROUTE_FIELDS, "The specs of a route are invalid.");

        // Normalize the HTTP method
        meth = specs.method.toLowerCase();

        // Check if the router has an handler for the requested HTTP method.
        // Note that we do not retrieve the handler as it would make the router
        // object's `this` object undefined (for some reasons).
        //
        // If not found, raise an error.
        handler = router.hasOwnProperty(meth);
        if (handler === undefined) {
            throw sprintf(`No such method '${specs.method}' (requested by '${specs.path}')`)
        }

        // Register the new route, and invoke the wrapped handler
        registerHandler(router, meth, routePrefix + "/" + specs.path, specs.handler(viewBuilderUtils))
    });
}

module.exports = function (cfg, views, viewUtils) {
    const primaryUrl = cfg.primaryEndpoint;
    const secondaryUrl = primaryUrl + "/:" + cfg.endpoint;

    const router = express.Router();

    // Register a given handler or a handler override to a given router.
    function registerView(method, path, viewName) {
        const override = cfg.viewOverrides[viewName];

        // Retrieve the correct and final handler,
        // if a override view was given, we call the override with the config.
        // Otherwise, we use the default view.
        let finalHandler = override
            ? override(cfg)
            : views[viewName];

        // Register the base view or the override
        registerHandler(router, method, path, finalHandler);
    }

    // Implement middlewares before URLs
    middlewares(router, primaryUrl, cfg);

    // Define the root routes
    registerView("get", primaryUrl, "getIndex");
    registerView("post", primaryUrl, "createOne");

    // Define the secondary routes (getter and setters)
    registerView("get", secondaryUrl, "getOne");
    registerView("put", secondaryUrl, "updateOne");
    registerView("post", secondaryUrl, "createAssoc");
    registerView("delete", secondaryUrl, "deleteOne");

    // Register additional handlers
    registerRoutes(router, viewUtils, primaryUrl, cfg.primaryAdditionalRoutes);
    registerRoutes(router, viewUtils, secondaryUrl, cfg.secondaryAdditionalRoutes);

    return router;
};
