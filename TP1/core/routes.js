const express = require("express");
const middlewares = require("./middlewares");

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
        if (!utils.allFields(base, REQUIRED_BASE_MODEL_DEF_FIELDS)) {
            throw "Missing field. Invalid configuration.";
        }
        baseUrl += base.pointName + "/:" + base.fieldName;
    }

    baseUrl += "/" + endpointName;
    return baseUrl;
}


module.exports = function (views, endpointName, model, bases) {
    const primaryUrl = buildUrl(endpointName, bases);
    const secondaryUrl = primaryUrl + "/:" + endpointName;

    const router = express.Router();

    // Implement middlewares before URLs
    middlewares(router, primaryUrl, model, bases);

    // Define the root routes
    router.get(primaryUrl, views.getIndex);
    router.post(primaryUrl, views.createOne);

    // Define the secondary routes (getter and setters)
    router.get(secondaryUrl, views.getOne);
    router.put(secondaryUrl, views.updateOne);
    router.delete(secondaryUrl, views.deleteOne);

    return router;
};
