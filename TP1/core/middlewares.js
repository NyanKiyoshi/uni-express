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
            });
        }

        // Populate req.user with the real user object from the db
        router.use(async (req, res, next) => {
            if (req.user) {
                const uid = req.user.uid;

                if (!uid) {
                    throw "Expected uid to be set on request.";
                }

                // Retrieve the user from the db
                const user = await models.User.findByPk(uid);

                // If the user is not found, raise a 401 error
                if (!user) {
                    next(new jwt.UnauthorizedError("no_such_user", { message: "No such user." }))
                } else {
                    req.user = user;
                }
            }

            next();
        });
    }

    if (cfg.bases.length > 0) {
        router.use(primaryUrl, middlewareCheckRequiredFound);
    }

    // Register the supplied restricted pattern
    registerRestrictedPatterns(cfg.restrictedPatterns);
};
