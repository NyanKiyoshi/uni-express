const express = require("express");
const app = require("../app");

module.exports = function (router, primaryUrl, model, bases) {
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

    if (bases.length > 0) {
        router.use(primaryUrl, middlewareCheckRequiredFound);
    }
};
