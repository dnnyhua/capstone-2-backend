"use strict";

/** Routes for users. */


const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Owner = require("../models/owner");
const Job = require("../models/job");
const Pet = require("../models/pet")
// const { createToken } = require("../helpers/tokens");
// const userNewSchema = require("../schemas/userNew.json");
// const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, role, city, state, zipcode,isAdmin }
 *
 * Authorization required: admin or same user-as-:username
**/

router.get("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const owner = await Owner.get(req.params.username);
        return res.json({ owner });
    } catch (err) {
        return next(err);
    }
});

router.get("/pet/:id", async function (req, res, next) {
    try {
        const pet = await Pet.get(req.params.id);
        return res.json({ pet });
    } catch (err) {
        return next(err);
    }

})

module.exports = router;