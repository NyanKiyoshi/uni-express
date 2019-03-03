const utils = require("./utils");

const REQUIRED_BASE_MODEL_DEF_FIELDS = [
    "pointName", "model", "fieldName"
];

module.exports = {
    /**
     * Builds the URL for the new endpoints from the bases.
     */
    buildUrl(endpointName, bases) {
        let baseUrl = "";
        let base;

        // Add all bases to the URL
        for (let i = 0; i < bases.length; ++i) {
            base = bases[i];
            utils.assertAllFields(
                base, REQUIRED_BASE_MODEL_DEF_FIELDS, "A base is invalid");
            baseUrl += "/" + base.pointName + "/:" + base.fieldName;
        }

        baseUrl += "/" + endpointName;
        return baseUrl;
    }
};
