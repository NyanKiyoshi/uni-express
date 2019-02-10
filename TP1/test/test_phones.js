const supertest = require('supertest');
const assert = require('assert');

const db = require("../db");
const models = require("../models");
const app = require('../app');
const _ = require("../routes");

beforeEach(async function () {
    await db.sync({ force: true }).then(value => {
        models.Person.create({
            id: 1,
            firstname: "John",
            lastname: "Doe"
        });
        models.Person.create({
            id: 2,
            firstname: "Miss",
            lastname: "Da Two"
        });
        models.Phone.create({
            id: 1,
            type: "work",
            number: "+33 6 00 00 00",
            PersonId: 2
        });
    })
});


exports.inexisting_should_person_return_404 = function(done){
    supertest(app)
        .get('/persons/555/phones')
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.person_without_number_should_return_empty = function(done){
    supertest(app)
        .get('/persons/1/phones')
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

exports.person_with_number_should_not_return_empty = function(done){
    supertest(app)
        .get('/persons/2/phones')
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(typeof body, typeof []);
            assert.strictEqual(body.length, 1);

            const data = body[0];
            assert.strictEqual(data["type"], "work");
            assert.strictEqual(data["number"], "+33 6 00 00 00");

            return done();
        });
};

exports.filter_numbers_valid_return = function(done){
    supertest(app)
        .get('/persons/2/phones?type=work')
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(typeof body, typeof []);
            assert.strictEqual(body.length, 1);

            return done();
        });
};

exports.filter_numbers_valid_return = function(done){
    supertest(app)
        .get('/persons/2/phones?type=home')
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

exports.get_inexisting_number = function(done){
    supertest(app)
        .get('/persons/2/phones/12')
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.get_existing_number = function(done){
    supertest(app)
        .get('/persons/2/phones/1')
        .expect(200)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body["type"], "work");
            assert.strictEqual(body["number"], "+33 6 00 00 00");

            return done();
        });
};

exports.create_new_number = function(done){
    supertest(app)
        .post('/persons/2/phones')
        .send({"type": "work", "number": "+23"})
        .expect(201)
        .end(async function (err, response) {
            assert.ifError(err);

            const body = JSON.parse(response.text);

            assert.strictEqual(body["PersonId"], "2");
            assert.strictEqual(body["type"], "work");
            assert.strictEqual(body["number"], "+23");

            return done();
        });
};

exports.update_inexisting_number = function(done){
    supertest(app)
        .put('/persons/2/phones/12')
        .send({"type": "home", "number": "+22 0000"})
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.update_existing_number = function(done){
    supertest(app)
        .put('/persons/2/phones/1')
        .send({"type": "home", "number": "+22 0000"})
        .expect(204)
        .end(async function (err, response) {
            assert.ifError(err);

            await models.Phone.findByPk(1).then(value => {
                assert.strictEqual(value.get("PersonId"), 2);
                assert.strictEqual(value.get("type"), "home");
                assert.strictEqual(value.get("number"), "+22 0000");
            }).catch(assert.ifError);

            return done();
        });
};

exports.delete_inexisting_number = function(done){
    supertest(app)
        .delete('/persons/2/phones/12')
        .expect(404)
        .expect("Content-Type", /^application\/json/)
        .end(function(err, response){
            assert.ifError(err);

            const body = JSON.parse(response.text);
            assert.strictEqual(body['error']['status'], 404);

            return done();
        });
};

exports.delete_existing_number = function(done){
    supertest(app)
        .delete('/persons/2/phones/1')
        .expect(204)
        .end(async function (err, response) {
            assert.ifError(err);

            await models.Phone.findByPk(1).then(value => {
                assert.ok(!value);
            });

            return done();
        });
};
