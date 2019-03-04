const jwt = require('express-jwt');

const utils = require("./utils");
const app = require("../app");
const models = require("../models");
const config = require("../config");

const REQUIRED_RESTRICTED_PATTERN_FIELDS = [
    "methods"
];

module.exports = function (router, primaryUrl, cfg) {
    async function middlewareCheckRequiredFound(req, res, next) {
        let base, entry;

        // Add all bases to the URL
        for (let i = 0; i < cfg.bases.length; ++i) {
            base = cfg.bases[i];
            entry = await base.model.findByPk(req.params[base.fieldName]);

            if (!entry) {
                app.throwNotFound(next);
                return;
            }
        }

        next();
    }

    if (cfg.bases.length > 0) {
        router.use(primaryUrl, middlewareCheckRequiredFound);
    }
};
