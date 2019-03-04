const suite = require("./suite");

const supertest = require('supertest');
const assert = require('assert');
const errors = require("../errors");

const db = require("../db");
const models = require("../models");
const app = require('../app');
const _ = require("../routes");

exports.get_inexisting_group_returns_404 = function(done) {
    supertest(app)
        .get('/groups/555')
        .set(suite.jwt.Headers)
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.get_existing_group_returns_valid = function(done) {
    supertest(app)
        .get('/groups/1')
        .set(suite.jwt.Headers)
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["title"], "group_1");

            return done();
        });
};

exports.inexisting_persons_group_should_return_404 = function(done) {
    supertest(app)
        .get('/groups/555/persons')
        .set(suite.jwt.Headers)
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.group_without_persons_should_return_empty = function(done) {
    supertest(app)
        .get('/groups/2/persons')
        .set(suite.jwt.Headers)
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(typeof body, typeof []);
            assert.strictEqual(body.length, 0);

            return done();
        });
};

exports.group_with_persons_should_not_return_empty = function(done) {
    supertest(app)
        .get('/groups/1/persons')
        .set(suite.jwt.Headers)
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(typeof body, typeof []);
            assert.strictEqual(body.length, 1);

            // Check the person is the expected one
            assert.strictEqual(body[0]["id"], 2);

            return done();
        });
};

exports.create_new_group = function(done) {
    supertest(app)
        .post('/groups')
        .set(suite.jwt.Headers)
        .send({"title": "new group"})
        .expect(201)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["title"], "new group");

            return done();
        });
};

exports.create_non_unique_group = function(done) {
    supertest(app)
        .post('/groups')
        .set(suite.jwt.Headers)
        .send({"title": "group_1"})
        .expect(400)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 400);
            assert.strictEqual(body['error']['message'], errors.ERR_RELATION_EXISTS);

            return done();
        });
};

exports.update_inexisting_group = function(done) {
    supertest(app)
        .put('/groups/555')
        .set(suite.jwt.Headers)
        .send({"title": "updated group"})
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.update_existing_group = function(done) {
    supertest(app)
        .put('/groups/1')
        .set(suite.jwt.Headers)
        .send({"title": "updated group"})
        .expect(204)
        .end(async function (err, response) {
            assert.ifError(err);

            await models.Group.findByPk(1).then(value => {
                assert.strictEqual(value.get("title"), "updated group");
            }).catch(assert.ifError);

            return done();
        });
};

exports.delete_inexisting_group = function(done) {
    supertest(app)
        .delete('/groups/555')
        .set(suite.jwt.Headers)
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.delete_existing_group = function(done) {
    supertest(app)
        .delete('/groups/1')
        .set(suite.jwt.Headers)
        .expect(204)
        .end(async function (err, response) {
            assert.ifError(err);

            await models.Group.findByPk(1).then(value => {
                assert.ok(!value);
            });

            return done();
        });
};
