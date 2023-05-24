"use strict";
const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");


class Job {

    /**
     * Returns {date_of_walk, time_of_walk, pet_ids, pet_sizes, owner_id, status} 
     * 
     * NOTE: pet_ids and pet_sizes will be a string
     * 
    */

    static async findAll({ date_of_walk, pet_sizes } = {}) {
        let query = `SELECT id,
                            to_char(date_of_walk::timestamp, 'YYYY-MM-DD') AS dateOfWalk,
                            time_of_walk at time zone 'utc' at time zone 'pst' AS timeOfWalk,
                            pet_ids,
                            pet_sizes AS petSizes,
                            owner_id AS ownerId, 
                            status
                    FROM jobs`
        const jobsRes = await db.query(query)
        console.log(jobsRes.rows)
        return jobsRes.rows
    }


}


module.exports = Job;
