const jwt = require('express-jwt');

const utils = require("./utils");
const app = require("../app");
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
            console.log(base.model.columns);
            entry = await base.model.findByPk(req.params[base.fieldName]);

            if (!entry) {
                app.throwNotFound(next);
                return;
            }
        }

        next();
    }

    function registerRestrictedPatterns(restrictedPatterns) {
        const jwtMiddleware = jwt({ secret: config.JWT_SECRET_KEY });
        let patternCfg;
        let patternToRestrict;

        for (let i = 0; i < restrictedPatterns.length; ++i) {
            patternCfg = restrictedPatterns[i];
            patternToRestrict = patternCfg.pattern || patternCfg.lazyPattern(cfg);

            // Ensure the pattern config is valid
            utils.assertAllFields(
                patternCfg,
                REQUIRED_RESTRICTED_PATTERN_FIELDS,
                "invalid restricted pattern"
            );

            // Register the middleware with method checking
            router.use(patternToRestrict, async (req, res, next) => {
                // Check the method (empty list means all methods)
                if (patternCfg.methods.length === 0 || patternCfg.methods.indexOf(req.method) > -1) {
                    jwtMiddleware(req, res, next);
                } else {
                    // Method not restricted, continue to process the request
                    next();
                }
            })
        }
    }

    if (cfg.bases.length > 0) {
        router.use(primaryUrl, middlewareCheckRequiredFound);
    }

    // Register the supplied restricted pattern
    registerRestrictedPatterns(cfg.restrictedPatterns);
};
