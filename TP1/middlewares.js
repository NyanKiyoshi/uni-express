const jwt = require('express-jwt');
const unless = require('express-unless');

const app = require("./app");
const models = require("./models");
const config = require("./config");

const jwtMiddleware = jwt({ secret: config.JWT_SECRET_KEY });

// Register the middleware with method checking
app.use(jwtMiddleware.unless({
    "path": [
        { url: /^\/users(\/\d+)?$/, methods: ['GET']  },
        { url: '/users/signup', methods: ['POST']  },
        { url: '/users/signin', methods: ['POST']  },
    ]
}));

// Populate req.user with the real user object from the db
app.use((req, res, next) => {
    if (req.user) {
        const uid = req.user.uid;

        if (!uid) {
            throw "Expected uid to be set on request.";
        }

        // Retrieve the user from the db
        models.User.findByPk(uid).then(user => {
            // If the user is not found, raise a 401 error
            if (!user) {
                next(new jwt.UnauthorizedError("no_such_user", {message: "No such user."}));
            } else {
                req.user = user;
                next();
            }
        });

        return;
    }

    next();
});
