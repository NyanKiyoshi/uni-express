const express = require('express');

const Person = require("../models").persons.Person;
const app = require("../app");

const views = require("./views");
const utils = require("./utils");

const HTTP_CONTENT_CREATED_STATUS = 201;
const HTTP_CONTENT_UPDATED_STATUS = 204;

const REQUIRED_BASE_MODEL_DEF_FIELDS = [
    "pointName", "model", "fieldName"
];


/**
 * @param {Sequelize.Model} model
 * @param {string} endpointName
 * @param {[]} bases
 * @param {[]} formFields
 * @param {[]} filterFields
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
module.exports = function (model, endpointName, bases, formFields, filterFields) {
    /**
     * Builds the URL for the new endpoints from the bases.
     */
    function buildUrl() {
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

    function middlewareCheckRequiredFound(req, res, next) {
        let base;
        const promises = [];

        // Add all bases to the URL
        for (let i = 0; i < bases.length; ++i) {
            base = bases[i];
            promises.push(base.findByPk(req.params[base.fieldName]));
        }


        app.query(next, Promise(promises).all(), values => {
            // If we found all the parents, we can continue.
            if (utils.allTrue(values)) {
                next();
            }
            else {
                app.throwNotFound(next);
            }
        });
    }

    const primaryUrl = buildUrl();
    const secondaryUrl = primaryUrl + "/:" + endpointName;

    const router = express.Router();

    // The parent of the model we are routing
    const parentFieldName = bases.length > 0 ? bases[bases.length - 1].fieldName : null;

    const internalViews = views(
        model, endpointName, parentFieldName, formFields, filterFields);

    router.get(primaryUrl, internalViews.getIndex);
    router.get(secondaryUrl, internalViews.getOne);

    return router;
};
