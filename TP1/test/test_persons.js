const suite = require("./suite");

const supertest = require('supertest');
const assert = require('assert');

const db = require("../db");
const models = require("../models");
const app = require('../app');
const _ = require("../routes");

exports.listing_persons_returns_valid = function(done) {
    supertest(app)
        .get('/persons')
        .set(suite.jwt.Headers)
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(typeof body, typeof []);
            assert.strictEqual(body.length, 2);

            const data = body[0];
            assert.strictEqual(data["firstname"], "John");
            assert.strictEqual(data["lastname"], "Doe");

            return done();
        });
};


exports.getting_inexisting_person = function(done) {
    supertest(app)
        .get('/persons/555')
        .set(suite.jwt.Headers)
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.filter_persons_valid_return = function(done) {
    supertest(app)
        .get('/persons?lastname=Doe')
        .set(suite.jwt.Headers)
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(typeof body, typeof []);
            assert.strictEqual(body.length, 1);

            return done();
        });
};

exports.filters_persons_invalid_filter = function(done) {
    supertest(app)
        .get('/persons?lastname=Doh')
        .set(suite.jwt.Headers)
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(typeof body, typeof []);
            assert.strictEqual(body.length, 0);

            return done();
        });
};

exports.create_new_person = function(done) {
    supertest(app)
        .post('/persons')
        .set(suite.jwt.Headers)
        .send({"firstname": "work", "lastname": "002"})
        .expect(201)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(body["firstname"], "work");
            assert.strictEqual(body["lastname"], "002");

            return done();
        });
};

exports.update_inexisting_person = function(done) {
    supertest(app)
        .put('/persons/555')
        .set(suite.jwt.Headers)
        .send({"firstname": "home", "lastname": "+22 0000"})
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.update_existing_person = function(done) {
    supertest(app)
        .put('/persons/1')
        .set(suite.jwt.Headers)
        .send({"firstname": "home", "lastname": "016"})
        .expect(200)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["id"], 1);
            assert.strictEqual(body["firstname"], "home");
            assert.strictEqual(body["lastname"], "016");

            return done();
        });
};

exports.delete_inexisting_person = function(done) {
    supertest(app)
        .delete('/persons/20')
        .set(suite.jwt.Headers)
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.delete_existing_number = function(done) {
    supertest(app)
        .delete('/persons/1')
        .set(suite.jwt.Headers)
        .expect(204)
        .end(async function (err, response) {
            assert.ifError(err);

            await models.Person.findByPk(1).then(value => {
                assert.ok(!value);
            });

            return done();
        });
};
