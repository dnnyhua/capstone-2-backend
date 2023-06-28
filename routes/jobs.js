"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const createJobSchema = require("../schemas/createJob.json");

const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureCorrectUserOrAdmin, ensureLoggedIn } = require("../middleware/auth");

const Job = require("../models/job");
const Owner = require("../models/owner");
const db = require("../db");
const { parse } = require("dotenv");

const router = express.Router();


/** GET / => { jobs: [ {date, time, pet_ids, owner_id, status] }
 * 
 * Returns list of all jobs.
 *
 * Authorization required: admin or correct user
 **/

router.get("/", async function (req, res, next) {

    const q = req.query
    console.log(q)

    if (q.city === "") {
        q.city = undefined
    }

    if (q.state === "") {
        q.state = undefined
    }

    if (q.zipcode !== undefined) {
        q.zipcode = parseInt(q.zipcode);
    } else {
        q.zipcode = undefined
    }

    try {
        const jobs = await Job.findAll(q);
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
});


/**
 * GET
 * 
 * Get job based on job ID
 * 
 */

router.get("/:id", async function (req, res, next) {
    try {
        const job = await Job.findByJobId(req.params.id);
        console.log(job)

        // convert pet_ids from str to number
        let petIdStr = job[0]['petIds']
        let petIdInt = petIdStr.split(",").map(Number);
        job[0]['petIds'] = petIdInt
        return res.json({ job })
    } catch (err) {
        return next(err);
    }
})


/** GET / => { jobs: [ {date, time, pet_ids, owner_id, status] }
 * 
 * Returns list of all jobs based on ownerId
 *
 * Authorization required: admin or correct user
 **/

router.get("/owner/:ownerId", async function (req, res, next) {
    const id = req.params.ownerId;

    try {
        const jobs = await Job.findByOwnerId(id);
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
});


/**
 * GET
 * 
 * Get pet's walk schedule based on pet ID
 * 
 */

router.get("/pet/:petId", ensureLoggedIn, async function (req, res, next) {
    try {
        const job = await Job.findByPetId(req.params.petId);
        return res.json({ job })
    } catch (err) {
        return next(err);
    }
})



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

    // convert string to integer
    data.zipcode = parseInt(data.zipcode)
    data.duration = parseInt(data.duration)

    // convert petIds array to string
    if (data.petIds) {
        data.petIds = data.petIds.join()
    }


    try {
        const validator = jsonschema.validate(data, createJobSchema)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }
        const job = await Job.create(data);
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

        const walkerId = result.rows[0]

        await Job.apply(walkerId, jobId);
        return res.json({ applied: jobId });
    } catch (err) {
        return next(err);
    }
});

/** PATCH / Update Job
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



/**
 * GET / Jobs applied by walkers. Allows owner to view all applicants who applied
 *
 * Returns(id, jobId, WalkerId, Status... walker info) 
 * 
 * Authorization required: admin or correct user
 */
router.get("/:jobId/applications", async function (req, res, next) {
    try {
        const applications = await Job.applications(req.params.jobId)
        return res.json({ applications })
    } catch (err) {
        return next(err)
    }

})


/**
 * Patch / Hire a walker
 * 
 * Update the status on the Jobs table and the AppliedJobs table
 * 
 */
router.patch("/hire/jobId/:jobId/walkerId/:walkerId", async function (req, res, next) {
    try {
        await Job.hireWalker(req.params.jobId, req.params.walkerId)
        return res.json({ hired: `For job: ${req.params.jobId}` });
    } catch (err) {
        return next(err)
    }
})


/**
     * GET
     * 
     * Get info on walker who was hired for a specific job
     * 
     */
router.get("/:jobId/hiredWalker", async function (req, res, next) {
    try {
        const user = await Job.getHiredWalker(req.params.jobId)
        return res.json({ user })
    } catch (err) {
        return next(err)
    }
})


/**
 * PATCH
 * 
 * Reject a walker's application
 */
router.patch("/reject/jobId/:jobId/walkerId/:walkerId", async function (req, res, next) {
    try {
        await Job.rejectWalker(req.params.jobId, req.params.walkerId)
    } catch (err) {
        return next(err)
    }
})



// WALKER's View

/**
 * GET
 * 
 * Get jobs that the walker applied to
 */

// router.get("/appliedJobs/:walkerId", async function (req, res, next) {
//     try {
//         await Job.getAppliedJobs(req.params.walkerId)
//     } catch (err) {
//         return next(err)
//     }
// })




/**
 * GET
 * 
 * Get jobs that the walker applied to using job Ids
 */

router.get("/appliedJobs/walkerId/:walkerId", async function (req, res, next) {

    try {
        const jobs = await Job.getAppliedJobs(req.params.walkerId)

        return res.json({ jobs })
    } catch (err) {
        return next(err)
    }
})


router.get("/status/jobId/:jobId/walkerId/:walkerId", async function (req, res, next) {
    try {
        const job = await Job.checkJobStatus(req.params.walkerId, req.params.jobId)
        return res.json({ job })
    } catch (err) {
        return next(err)
    }
})
module.exports = router;



