const sprintf = require('sprintf-js').sprintf;
const meths = {};

/**
 * Checks that all objects of a given iterable are not true.
 *
 * @param iterable
 * @returns {boolean}
 */
meths.allTrue = function (iterable) {
    for (let i = 0; i < iterable.length; i++) {
        if (!iterable[i]) {
            return false;
        }
    }
    return true;
};

/**
 * Checks that every given field is set and not empty
 * in the given object.
 *
 * @param obj
 * @param fields
 * @returns {string} Empty if success. Missing field name otherwise.
 */
meths.allFields = function (obj, fields) {
    let fieldName;

    for (let i = 0; i < fields.length; i++) {
        fieldName = fields[i];
        if (!obj[fieldName]) {
            return fieldName;
        }
    }
};

/**
 * Assert that every given field is set and not empty
 * in the given object.
 *
 * @param obj
 * @param fields
 */
meths.assertAllFields = function (obj, fields, help) {
    const missingField = meths.allFields(obj, fields);
    if (missingField) {
        throw help + " A field is missing: " + missingField;
    }
};

meths.implementSpecs = function(target, definitions) {
    let targetValue;
    let specs;
    let newValue;

    Object.keys(definitions).forEach(function (fieldName) {
        targetValue = target[fieldName];
        specs = definitions[fieldName];

        // If the target does not have a value, set it.
        if (!targetValue) {
            if (specs.lazyDefault !== undefined) {
                newValue = specs.lazyDefault(target)
            }
            else if (specs.default === undefined) {
                throw "Invalid configuration, a field is missing: " + fieldName;
            }
            else {
                newValue = specs.default
            }

            // Set the default value
            target[fieldName] = newValue
        }
        // If the specs define a type, check the value has the correct one.
        else if (specs.type !== undefined && typeof targetValue !== specs.type) {
            throw sprintf(
                `Invalid configuration, expected '${fieldName}' to be of type: '${specs.type}', but got '${typeof targetValue}' instead.`
            );
        }
    })
};

// export the methods
module.exports = meths;
