"use strict";
/** Database setup for walkies. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let db = new Client(getDatabaseUri())

if (process.env.NODE_ENV === "production") {
    db = new Client({
        connectionString: getDatabaseUri()
    });
} else {
    db = new Client({
        connectionString: getDatabaseUri(),
    });
}

db.connect();

module.exports = db;



