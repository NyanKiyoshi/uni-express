const fs = require("fs");
const path = require("path");
const db = require("../db");

// this object will contain the model objects
// each key being the model's name
const models = {};

// read the files of the current directory
fs.readdirSync(__dirname)
    .filter((filename) =>
        // do not handle the current file
        filename !== 'index.js'
    )
    .forEach((filename) => {
        // Remove the file extension
        filename = filename.split(".")[0];

        // Import the model
        models[filename] = require(path.join(__dirname, filename));
    });

// expose the db object
module.exports = models;
