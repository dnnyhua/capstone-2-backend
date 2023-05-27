"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const createJobSchema = require("../schemas/createJob.json");

const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const Job = require("../models/job");
const Owner = require("../models/owner");
const db = require("../db");

const router = express.Router();


/** GET / => { jobs: [ {date, time, pet_ids, owner_id, status] }
 * 
 * Returns list of all jobs.
 *
 * Authorization required: admin or correct user
 **/

router.get("/", async function (req, res, next) {
    const q = req.query;

    try {
        const jobs = await Job.findAll(q);
        return res.json({ jobs });
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

router.post("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {
    let data = req.body

    // get ownerId so that it can be included on the job that will be created
    const user = await Owner.get(req.params.username)
    const { ownerId } = user
    data.ownerId = ownerId

    // Include the ownerId in the job data
    data = { ...req.body, ownerId }
    console.log(data)

    try {
        const validator = jsonschema.validate(data, createJobSchema)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    } catch (err) {
        return next(err);
    }

})



/** PATCH / Update Job
*
* create job -> { date, time, pet_name }
*
* Returns {date, time, pet_ids, pet_sizes, owner_id, address, city, state, zipcode, status  }
*
* Authorization required: admin or correct user
*/
router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const job = await Job.update(req.params.id, req.body)
        console.log(job)
        return res.status(201).json({ job })
    } catch (err) {
        return next(err);
    }

})


/** DELETE /[job]  =>  { deleted: job_id }
 *
 * Authorization required: admin or same-user-as-:username
 **/

router.delete("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {

    try {
        await Job.remove(+req.params.id);
        return res.json({ deleted: +req.params.id });
    } catch (err) {
        return next(err);
    }
});



/** POST /jobs/username/jobId
 *
 * Returns {"applied": jobId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post("/:username/job/:jobId", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const username = req.params.username;
        const jobId = +req.params.jobId
        const result = await db.query(
            `SELECT w.id AS "walkerId"
            FROM walkers w
            JOIN users u ON w.user_id = u.id
            WHERE username = $1`,
            [username]
        );

        console.log(jobId)
        const walkerId = result.rows[0]
        console.log(walkerId)


        await Job.apply(walkerId, jobId);
        return res.json({ applied: jobId });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;