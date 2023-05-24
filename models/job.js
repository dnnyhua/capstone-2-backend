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
     * Returns {date, time, pet_ids, pet_sizes, owner_id, status} 
     * 
     * NOTE: pet_ids and pet_sizes will be a string
     * 
    */

    static async findAll({ pet_sizes } = {}) {
        console.log(pet_sizes)

        let query = `SELECT id,
                            to_char(date::timestamp, 'YYYY-MM-DD') AS date,
                            time at time zone 'utc' at time zone 'pst',
                            pet_ids,
                            pet_sizes AS petSizes,
                            owner_id AS ownerId, 
                            status
                    FROM jobs`

        let whereExpressions = [];
        let queryValues = [];

        if (pet_sizes !== undefined) {
            queryValues.push(`%${pet_sizes}%`)
            whereExpressions.push(`pet_sizes ILIKE $${queryValues.length}`);
        }

        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
        }

        console.log(query)
        const jobsRes = await db.query(query, queryValues)
        console.log(jobsRes.rows)
        return jobsRes.rows
    }

}


module.exports = Job;
