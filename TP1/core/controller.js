const oneToManyViews = require("./viewManagers/oneToManyViews");
const manyToManyViews = require("./viewManagers/manyToManyViews");
const routeBuilder = require("./routes");
const oneToManyUtils = require("./viewUtils/oneToManyUtils");
const manyToManyUtils = require("./viewUtils/manyToManyUtils");
const utils = require("./utils");
const routingUtils = require("./routing_utils");

const configurationSpecs = {
    // Defines the model to generate REST from.
    "model": {
        type: "function"
    },

    // Defines the model structure to use for the REST handling.
    "is_many_to_many": {
        type: "boolean",
        default: false
    },

    // Defines the REST start endpoint.
    "endpoint": {
        type: "string"
    },

    // Defines the bases of the new REST endpoint.
    "bases": {
        type: "object",
        default: []
    },

    // Defines the exposed form fields.
    "formFields": {
        type: "object",
        default: []
    },

    // Defines the exposed filterable fields.
    "filterFields": {
        type: "object",
        default: []
    },

    // Defines the parent of the model we are routing.
    "parentFieldName": {
        type: "string",
        lazyDefault: function (cfg) {
            return cfg.bases.length > 0
                ? cfg.bases[cfg.bases.length - 1].fieldName
                : null;
        }
    },

    // Defines the start endpoint of the REST application.
    "primaryEndpoint": {
        type: "string",
        lazyDefault: function (cfg) {
            return routingUtils.buildUrl(cfg.endpoint, cfg.bases);
        }
    },

    // Defines the override handlers for the REST endpoint views.
    // Usage: { internalViewName: cfg => (res, req[, next]) => ... }
    //
    // Note, the view can be disabled by returning null as wrapped view.
    // Example: { viewName: cfg => null }
    "viewOverrides": {
        type: "object",
        default: {}
    },

    // Defines additional routes to handle and pass the REST manager.
    // This must be of the format:
    // [
    //    {
    //        path: "my-sub-route/blah/blah"
    //        method: "GET",
    //        handler: (utils) =>
    //                    (request, response, next) => handler...
    //    }
    // ]
    "primaryAdditionalRoutes": {
        type: "object",
        default: []
    },

    // Same as 'primaryAdditionalRoutes'
    "secondaryAdditionalRoutes": {
        type: "object",
        default: []
    }
};

/**
 *
 * @param cfg
 *
 * Bases are defined this way:
 *
 const bases = [
 // /{pointName}/:{fieldName}/{endpointName}
        {
            "pointName": "products",
            "model": Person,
            "fieldName": "PersonID"
        }
 ];
 */
module.exports = function (cfg) {
    // Ensure the configuration is valid and set the default values
    utils.implementSpecs(cfg, configurationSpecs);

    const viewUtils = oneToManyUtils(
        cfg.endpoint, cfg.parentFieldName, cfg.formFields, cfg.filterFields);
    let internalViews;

    if (cfg.is_many_to_many) {
        if (!cfg.bases) {
            throw "Many to Many REST requires bases."
        }

        manyToManyUtils(viewUtils, cfg);
        internalViews = manyToManyViews(cfg, viewUtils);
    }
    else {
        internalViews = oneToManyViews(cfg, viewUtils);
    }


    return routeBuilder(cfg, internalViews, viewUtils);
};
