"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
// const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
// const { createToken } = require("../helpers/tokens");
// const userNewSchema = require("../schemas/userNew.json");
// const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();



/** GET / => { users: [ {username, firstName, lastName, email, role }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/", (req, res, next) => { console.log("ensure admin checked"); return next(); }, async function (req, res, next) {
    try {
        const users = await User.findAll();
        console.log(users)
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
