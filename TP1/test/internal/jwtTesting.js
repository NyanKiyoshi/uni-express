const supertest = require("supertest");
const app = require("../../app");

jwt = {
    AccessToken: "",
    Headers: {}
};

async function _getAccessToken() {
    const resp = await supertest(app)
        .post('/users/signin')
        .send({"username": "admin", "password": "admin123"});

    if (resp.statusCode !== 200) {
        throw "Failed to get JWT auth token";
    }

    jwt.AccessToken = JSON.parse(resp.text)["accessToken"];

    if (!jwt.AccessToken) {
        throw "Did not get a access token.";
    }

    jwt.Headers.Authorization = "Bearer " + jwt.AccessToken;
}

jwt.getAccessToken = function() {
    return _getAccessToken();
};

module.exports = jwt;
