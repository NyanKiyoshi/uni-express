const app = require("../app");
const Group = require("../models/Group");

module.exports = {
    getGroupPersons: utils => (request, response, next) => {
        app.query(next, Group.findOne(utils.buildWhereRequest(request)),
            async results => {
                if (!results) {
                    app.throwNotFound(next);
                    return
                }

                const persons = await results.getPersons();
                response.json(persons);
            }
        );
    }
};
