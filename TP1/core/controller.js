const viewsBuilder = require("./views");
const routeBuilder = require("./routes");
const utils = require("./utils");

const configurationSpecs = {
    // Defines the model to generate REST from.
    "model": {
        type: "function"
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
        type: String,
        lazyDefault: function (cfg) {
            return cfg.bases.length > 0
                ? cfg.bases[cfg.bases.length - 1].fieldName
                : null;
        }
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

    const internalViews = viewsBuilder(cfg);
    return routeBuilder(cfg, internalViews);
};
