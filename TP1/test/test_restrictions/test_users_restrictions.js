const supertest = require('supertest');
const assert = require('assert');
const errors = require("../../errors");

const db = require("../../db");
const models = require("../../models");
const app = require('../../app');
const _ = require("../../routes");

beforeEach(async function () {
    await db.sync({ force: true }).then(async value => {
        const personWithoutGroup = await models.Person.create({
            id: 1,
            firstname: "John",
            lastname: "Doe"
        });

        const personWithGroup = await models.Person.create({
            id: 2,
            firstname: "Miss",
            lastname: "Da Two"
        });

        const groupWithPersons = await models.Group.create({
            id: 1,
            title: "group_1"
        });

        const emptyGroup = await models.Group.create({
            id: 2,
            title: "group_2"
        });

        await groupWithPersons.addPerson(personWithGroup);
    })
});

exports.getting_user_is_not_restricted = function(done) {
    supertest(app)
        .put('/users/123')
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);
            return done();
        });
};

exports.posting_user_is_not_restricted = function(done) {
    supertest(app)
        .post('/users/123')
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);
            return done();
        });
};

exports.updating_user_is_restricted = function(done) {
    supertest(app)
        .put('/users/123')
        .expect(403)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["error"]["status"], 403);
            assert.strictEqual(body["error"]["message"], errors.ERR_ACCESS_RESTRICTED);

            return done();
        });
};

exports.deleting_user_is_restricted = function(done) {
    supertest(app)
        .delete('/users/123')
        .expect(403)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["error"]["status"], 403);
            assert.strictEqual(body["error"]["message"], errors.ERR_ACCESS_RESTRICTED);

            return done();
        });
};
