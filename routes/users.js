"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
// const { createToken } = require("../helpers/tokens");
// const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();



/** GET / => { users: [ {username, firstName, lastName, email, role }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin.
 **/

router.get("/", ensureAdmin, async function (req, res, next) {
    try {
        const users = await User.findAll();
        return res.status(200).json({ users });
    } catch (err) {
        return next(err);
    }
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, role, city, state, zipcode,isAdmin }
 *
 * Authorization required: admin or same user-as-:username
**/

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const user = await User.getUser(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    let data = req.body
    data.zipcode = parseInt(data.zipcode)
    console.log(data)
    try {
        const validator = jsonschema.validate(data, userUpdateSchema);
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const user = await User.update(req.params.username, data);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ deleted: req.params.username });
    } catch (err) {
        return next(err);
    }
});



module.exports = router;
