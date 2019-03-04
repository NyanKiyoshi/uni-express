module.exports = {
    "DATABASE_URL": process.env.DATABASE_URL || "postgres://w4a:w4a@127.0.0.1:5432/W4a",
    "HTTP_LISTEN_PORT": process.env.HTTP_LISTEN_PORT || 5000,
    "HTTP_LISTEN_HOST": process.env.HTTP_LISTEN_HOST || "127.0.0.1",
    "JWT_SECRET_KEY": process.env.JWT_SECRET_KEY,
    "JWT_EXPIRES_IN": process.env.JWT_EXPIRES_IN || "3h",
};


if (!module.exports.JWT_SECRET_KEY) {
    throw "The JWT secret key must be set.";
}
