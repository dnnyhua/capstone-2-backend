"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Walker = require("../models/walker");
// const { createToken } = require("../helpers/tokens");
// const userNewSchema = require("../schemas/userNew.json");
// const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, role, city, state, zipcode, isAdmin }
 *
 * Authorization required: admin or same user-as-:username
**/

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const user = await Walker.get(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});






module.exports = router;