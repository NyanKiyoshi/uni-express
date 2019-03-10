const suite = require("./suite");

const supertest = require('supertest');
const assert = require('assert');

const models = require("../models");
const app = require('../app');
const _ = require("../routes");

exports.inexisting_should_person_return_404 = function(done) {
    supertest(app)
        .get('/persons/555/postalAddresses')
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

exports.person_without_address_number_should_return_empty = function(done) {
    supertest(app)
        .get('/persons/1/postalAddresses')
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

exports.person_with_address_number_should_not_return_empty = function(done) {
    supertest(app)
        .get('/persons/2/postalAddresses')
        .set(suite.jwt.Headers)
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(typeof body, typeof []);
            assert.strictEqual(body.length, 1);

            const data = body[0];
            assert.strictEqual(data["type"], "work");
            assert.strictEqual(data["address"], "3 rue");

            return done();
        });
};

exports.filter_phone_numbers_valid_return = function(done) {
    supertest(app)
        .get('/persons/2/postalAddresses?type=work')
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

exports.filter_phone_numbers_valid_return = function(done) {
    supertest(app)
        .get('/persons/2/postalAddresses?type=home')
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

exports.get_inexisting_number = function(done) {
    supertest(app)
        .get('/persons/2/postalAddresses/12')
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

exports.get_existing_number = function(done) {
    supertest(app)
        .get('/persons/2/postalAddresses/1')
        .set(suite.jwt.Headers)
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["type"], "work");
            assert.strictEqual(body["address"], "3 rue");

            return done();
        });
};

exports.create_new_address_number = function(done) {
    supertest(app)
        .post('/persons/2/postalAddresses')
        .set(suite.jwt.Headers)
        .send({"type": "home", "address": "6 rue"})
        .expect(201)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(body["PersonId"], "2");
            assert.strictEqual(body["type"], "home");
            assert.strictEqual(body["address"], "6 rue");

            return done();
        });
};

exports.update_inexisting_number = function(done) {
    supertest(app)
        .put('/persons/2/postalAddresses/12')
        .set(suite.jwt.Headers)
        .send({"type": "home", "address": "+22 0000"})
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.update_existing_number = function(done) {
    supertest(app)
        .put('/persons/2/postalAddresses/1')
        .set(suite.jwt.Headers)
        .send({"type": "home", "address": "7 rue"})
        .expect(200)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["id"], 1);
            assert.strictEqual(body["PersonId"], 2);
            assert.strictEqual(body["type"], "home");
            assert.strictEqual(body["address"], "7 rue");

            return done();
        });
};

exports.delete_inexisting_number = function(done) {
    supertest(app)
        .delete('/persons/2/postalAddresses/12')
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
        .delete('/persons/2/postalAddresses/1')
        .set(suite.jwt.Headers)
        .expect(204)
        .end(async function (err, response) {
            assert.ifError(err);

            await models.PostalAddress.findByPk(1).then(value => {
                assert.ok(!value);
            });

            return done();
        });
};
