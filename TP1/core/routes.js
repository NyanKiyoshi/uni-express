const express = require("express");
const middlewares = require("./middlewares");
const utils = require("./utils");

const REQUIRED_BASE_MODEL_DEF_FIELDS = [
    "pointName", "model", "fieldName"
];

/**
 * Builds the URL for the new endpoints from the bases.
 */
function buildUrl(endpointName, bases) {
    let baseUrl = "";
    let base;

    // Add all bases to the URL
    for (let i = 0; i < bases.length; ++i) {
        base = bases[i];
        utils.assertAllFields(base, REQUIRED_BASE_MODEL_DEF_FIELDS);
        baseUrl += "/" + base.pointName + "/:" + base.fieldName;
    }

    baseUrl += "/" + endpointName;
    return baseUrl;
}

module.exports = function (cfg, views) {
    const primaryUrl = buildUrl(cfg.endpoint, cfg.bases);
    const secondaryUrl = primaryUrl + "/:" + cfg.endpoint;

    const router = express.Router();

    // Implement middlewares before URLs
    middlewares(router, primaryUrl, cfg.model, cfg.bases);

    // Define the root routes
    router.get(primaryUrl, views.getIndex);
    router.post(primaryUrl, views.createOne);

    // Define the secondary routes (getter and setters)
    router.get(secondaryUrl, views.getOne);
    router.put(secondaryUrl, views.updateOne);
    router.delete(secondaryUrl, views.deleteOne);

    return router;
};
