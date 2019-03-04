const jwt = require("jsonwebtoken");

const fieldUtils = require("../core/utils");
const errors = require("../errors");
const config = require("../config");

const app = require("../app");
const User = require("../models/User");

const SIGN_IN_REQUIRED_FIELDS = ["username", "password"];

function signInUser(user) {
    return jwt.sign({
        uid: user.id
    }, config.JWT_SECRET_KEY, {
        expiresIn: config.JWT_EXPIRES_IN
    });
}

module.exports = {
    postSignIn: utils => (request, response, next) => {

        // Check the form is valid
        if (fieldUtils.allFields(request.body, SIGN_IN_REQUIRED_FIELDS) != null) {
            next({
                status: 400,
                message: errors.ERR_INVALID_FORM
            });

            return;
        }

        // Build the request
        const userRequest = User.findOne({
            where: {
                username: request.body.username
            }
        });

        // Wait for the user to be returned, and check the password
        app.query(next, userRequest,
            async user => {
                if (user && user.checkPassword(request.body.password)) {
                    // Password is valid, sign in the user
                    response.json({
                        accessToken: signInUser(user),
                        user: user
                    });
                    return
                }

                // No such user or invalid password
                next({
                    status: 401,
                    message: errors.ERR_INVALID_LOGIN
                })
            }
        );
    },
    postSignUp: utils => (request, response, next) => {
        response.status(400).json({});
    }
};
