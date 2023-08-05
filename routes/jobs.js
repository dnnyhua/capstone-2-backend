"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");
const createJobSchema = require("../schemas/createJob.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureCorrectUserOrAdmin, ensureLoggedIn } = require("../middleware/auth");

const Job = require("../models/job");
const Owner = require("../models/owner");

const router = express.Router();


/** GET / => { jobs: [ {date, time, pet_ids, owner_id, status] }
 * 
 * Returns list of all jobs.
 *
 * Authorization required: admin or correct user
 **/
router.get("/", async function (req, res, next) {
    try {
        let { city, state, zipcode } = req.query
        city = city ? city.toLocaleLowerCase() : undefined;
        state = state ? state.toLocaleLowerCase() : undefined;
        zipcode = zipcode ? parseInt(zipcode, 10) : undefined;

        // For pagination
        const page = req.query.page || 1;
        const limit = 10;
        const offset = (page - 1) * limit || 0;

        const jobs = await Job.findAll(city, state, zipcode, limit, offset);
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
});


/** GET
 * 
 * Get job based on job ID
 */
router.get("/:id", async function (req, res, next) {
    try {
        const job = await Job.findByJobId(req.params.id);

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
router.get("/:status/owner/:ownerId", async function (req, res, next) {
    const ownerId = req.params.ownerId;
    const status = req.params.status;

    try {
        const jobs = await Job.getOwnerJobs({ ownerId, status });
        return res.json({ jobs });
    } catch (err) {
        return next(err);
    }
});


/** GET
 * 
 * Get pet's walk schedule based on pet ID
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
* Returns {date, time, pet_ids, owner_id, status  }
*
* Authorization required: admin or correct user
*/
router.post("/:username", ensureCorrectUserOrAdmin, async function (req, res, next) {

    let { address, city, state, zipcode, duration, petIds, date, time } = req.body

    // get ownerId so that it can be included on the job that will be created
    const user = await Owner.get(req.params.username)
    const { ownerId } = user

    // Lowercase strings
    address = address.toLowerCase()
    city = city.toLowerCase()
    state = state.toLowerCase()

    // convert string to integer
    zipcode = parseInt(zipcode)
    duration = parseInt(duration)

    // convert petIds array to string
    if (petIds) {
        petIds = petIds.join()
    }

    let data = { ownerId, address, city, state, zipcode, duration, petIds, date, time }

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
* Returns {date, time, pet_ids, owner_id, address, city, state, zipcode, status  }
*
* Authorization required: admin or correct user
*/
router.patch("/:username/jobId/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    let data = req.body

    // convert string to integer
    data.zipcode = parseInt(data.zipcode)
    data.duration = parseInt(data.duration)

    // convert petIds array to string
    if (data.petIds) {
        data.petIds = data.petIds.join()
    }

    try {
        const validator = jsonschema.validate(req.body, userUpdateSchema)
        if (!validator.valid) {
            const errs = validator.errors.map(e => e.stack);
            throw new BadRequestError(errs);
        }

        const job = await Job.update(req.params.id, data)
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


/** POST 
 *
 * Walker Applies to a job
 * 
 * Returns {"applied": jobId}
 **/

router.post("/:username/jobId/:jobId", ensureCorrectUserOrAdmin, async function (req, res, next) {
    try {
        const { firstName, lastName, walkerId, rate, bio, profileImage } = req.query
        const jobId = +req.params.jobId

        await Job.apply(walkerId, firstName, lastName, jobId, rate, bio, profileImage);
        return res.json({ applied: jobId });
    } catch (err) {
        return next(err);
    }
});


/** GET 
 * 
 * Gets Job applications for specific jobId. Allows owner to view all applicants who applied to that job
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


/** Patch / Hire a walker
 * 
 * Update the status on the Jobs table and the AppliedJobs table
 */
router.patch("/hire/jobId/:jobId/walkerId/:walkerId", async function (req, res, next) {
    try {
        await Job.hireWalker(req.params.jobId, req.params.walkerId)
        return res.json({ hired: `For job: ${req.params.jobId}` });
    } catch (err) {
        return next(err)
    }
})


/** GET
 * 
 * Get info on walker who was hired for a specific job Id
 */
router.get("/:jobId/hiredWalker", async function (req, res, next) {
    try {
        const user = await Job.getHiredWalker(req.params.jobId)
        return res.json({ user })
    } catch (err) {
        return next(err)
    }
})


/** PATCH
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


/** GET
 * 
 * Get jobs that the walker applied to using job Ids
 */
router.get("/appliedJobs/:status/walkerId/:walkerId", async function (req, res, next) {

    const walkerId = req.params.walkerId
    const status = req.params.status
    const jobIds = JSON.parse(req.query.jobIds);
    console.log(jobIds)

    try {
        const jobs = await Job.getAppliedJobs(walkerId, status, jobIds)
        return res.json({ jobs })
    } catch (err) {
        return next(err)
    }
})


/** GET
 *  
 * Checks job status for walker. Will mainly be used to determine if the address can be revealed
 * 
 * NOTE: SHOULD REFACTOR SO THAT ALL CHECKS ARE DONE IN THE BACKEND SO THAT THE ADDRESS DOES NOT APPEAR IN THE FRONTEND AT ALL IF THE WALKER WAS NOT HIRED; NOT THE CASE AT THE MOMENT
 */
router.get("/status/jobId/:jobId/walkerId/:walkerId", async function (req, res, next) {
    try {
        const job = await Job.checkJobStatus(req.params.walkerId, req.params.jobId)
        return res.json({ job })
    } catch (err) {
        return next(err)
    }
})
module.exports = router;



