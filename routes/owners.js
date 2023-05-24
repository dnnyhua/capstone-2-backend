"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Owner = require("../models/owner");
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
        const user = await Owner.get(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});



/** POST / Create Job
 *
 * create job -> { date, time, pet_name }
 *
 * Returns {date, time, pet_ids, pet_sizes, owner_id, status  }
 *
 * Authorization required: admin or correct user
 */


/** 
 * NOTES: when the createjob form is submitted { date, time, pet_names }
 * 
 * need to look up pet_ids for pet_names?
 * 
 * 
 **/

router.post("/:username/createJob", ensureCorrectUserOrAdmin, async function (req, res, next) {


})




module.exports = router;