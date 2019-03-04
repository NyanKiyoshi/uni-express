const suite = require("../suite");

const supertest = require('supertest');
const assert = require('assert');
const errors = require("../../errors");

const app = require('../../app');
const _ = require("../../routes");

exports.getting_user_is_not_restricted = function(done) {
    supertest(app)
        .get('/users/123')
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);
            return done();
        });
};

exports.posting_user_is_restricted = function(done) {
    supertest(app)
        .post('/users/123')
        .expect(401)
        .end(function(err, response) {
            assert.ifError(err);
            return done();
        });
};

exports.updating_user_is_restricted = function(done) {
    supertest(app)
        .put('/users/123')
        .expect(401)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["error"]["status"], 401);
            assert.strictEqual(body["error"]["message"], errors.ERR_ACCESS_RESTRICTED);

            return done();
        });
};

exports.deleting_user_is_restricted = function(done) {
    supertest(app)
        .delete('/users/123')
        .expect(401)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["error"]["status"], 401);
            assert.strictEqual(body["error"]["message"], errors.ERR_ACCESS_RESTRICTED);

            return done();
        });
};

exports.login_is_unrestricted = function(done) {
    supertest(app)
        .post('/users/signin')
        .expect(400)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);
            return done();
        });
};

exports.register_is_unrestricted = function(done) {
    supertest(app)
        .post('/users/signup')
        .expect(400)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response) {
            assert.ifError(err);
            return done();
        });
};
