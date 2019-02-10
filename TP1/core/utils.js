module.exports = {
    /**
     * Checks that all objects of a given iterable are not true.
     *
     * @param iterable
     * @returns {boolean}
     */
    allTrue: function (iterable) {
        for (let i = 0; i < iterable.length; i++) {
            if (!iterable[i]) {
                return false;
            }
        }
        return true;
    },

    /**
     * Checks that every given field is set and not empty
     * in the given object.
     *
     * @param obj
     * @param fields
     * @returns {boolean}
     */
    allFields: function (obj, fields) {
        for (let i = 0; i < fields.length; i++) {
            if (!obj[fields[i]]) {
                return false;
            }
        }
        return true;
    }
};

