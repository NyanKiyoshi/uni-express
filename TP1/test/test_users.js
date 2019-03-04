const supertest = require('supertest');
const assert = require('assert');
const errors = require("../errors");

const db = require("../db");
const models = require("../models");
const app = require('../app');
const _ = require("../routes");

beforeEach(async function () {
    await db.sync({ force: true }).then(async value => {
        await models.User.create({
            id: 1,
            username: "admin",
            password: "admin123"
        });
        await models.User.create({
            id: 2,
            username: "user123",
            password: "user456"
        });
    })
});

// Ensure no password or hash is returned
function mustNotHavePasswordFields(obj) {
    assert.strictEqual(obj["password"], undefined);
    assert.strictEqual(obj["password_hash"], undefined);
}

exports.get_inexisting_user_returns_404 = function(done) {
    supertest(app)
        .get('/users/555')
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.get_existing_user_returns_valid = function(done) {
    supertest(app)
        .get('/users/1')
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);

            // Check the fields
            assert.strictEqual(body["id"], 1);
            assert.strictEqual(body["username"], "admin");

            // Ensure no password or hash is returned
            mustNotHavePasswordFields(body);

            return done();
        });
};

exports.listing_users_returns_valid = function(done) {
    supertest(app)
        .get('/users')
        .expect(200)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);

            // Is the body an array as we expect?
            // Is there the correct number of users?
            assert.strictEqual(Array.isArray(body), true);
            assert.strictEqual(body.length, 2);

            // Check the entities
            assert.strictEqual(body[0]["username"], "admin");
            assert.strictEqual(body[1]["username"], "user123");

            // Ensure no password field were returned
            mustNotHavePasswordFields(body[0]);

            return done();
        });
};

exports.cannot_create_user_from_root_endpoint = function(done) {
    supertest(app)
        .post('/users')
        .expect(404)
        .end(async function (err, response) {
            assert.ifError(err);
            return done();
        });
};

exports.cannot_create_user_from_root_endpoint = function(done) {
    supertest(app)
        .post('/users')
        .expect(404)
        .end(async function (err, response) {
            assert.ifError(err);
            return done();
        });
};

exports.sign_in_invalid_form = function(done) {
    supertest(app)
        .post('/users/signin')
        .send({})
        .expect(400)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["error"]["status"], 400);
            assert.strictEqual(body["error"]["message"], errors.ERR_INVALID_FORM);

            return done();
        });
};

exports.sign_in_invalid_username = function(done) {
    supertest(app)
        .post('/users/signin')
        .send({"username": "hello", "password": "admin"})
        .expect(401)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["error"]["status"], 401);
            assert.strictEqual(body["error"]["message"], errors.ERR_INVALID_LOGIN);

            return done();
        });
};

exports.sign_in_invalid_password = function(done) {
    supertest(app)
        .post('/users/signin')
        .send({"username": "admin", "password": "admin000"})
        .expect(401)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["error"]["status"], 401);
            assert.strictEqual(body["error"]["message"], errors.ERR_INVALID_LOGIN);

            return done();
        });
};

exports.sign_in_valid_login = function(done) {
    supertest(app)
        .post('/users/signin')
        .send({"username": "admin", "password": "admin123"})
        .expect(200)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["user"]["id"], 1);

            if (!body["accessToken"]) {
                assert.fail("Body did not return the access token");
            }

            return done();
        });
};
