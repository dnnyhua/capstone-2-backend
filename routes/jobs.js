"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");

const Job = require("../models/job");
const router = express.Router();


/** GET / => { users: [ {date_of_walk, time_of_walk, pet_ids, pet_sizes, owner_id, status] }
 * 
 * Returns list of all jobs.
 *
 * Authorization required: admin
 **/

router.get("/", async function (req, res, next) {
    try {
        const jobs = await Job.findAll();
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;