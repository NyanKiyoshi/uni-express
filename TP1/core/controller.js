const views = require("./views");
const routes = require("./routes");

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
    // The parent of the model we are routing
    const parentFieldName = bases.length > 0
        ? bases[bases.length - 1].fieldName
        : null;

    const internalViews = views(
        model, endpointName, parentFieldName, formFields, filterFields);
    return routes(internalViews, endpointName, model, bases);
};
