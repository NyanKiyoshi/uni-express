const app = require("../app");

module.exports = function (router, primaryUrl, model, bases) {
    async function middlewareCheckRequiredFound(req, res, next) {
        let base, entry;

        // Add all bases to the URL
        for (let i = 0; i < bases.length; ++i) {
            base = bases[i];
            console.log(base.model.columns);
            entry = await base.model.findByPk(req.params[base.fieldName]);

            if (!entry) {
                app.throwNotFound(next);
                return;
            }
        }

        next();
    }

    if (bases.length > 0) {
        router.use(primaryUrl, middlewareCheckRequiredFound);
    }
};
