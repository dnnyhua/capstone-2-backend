"use strict";
const db = require("../db");
const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");


class Walker {


    /** Given a username, return data about owner.
     *
     * Returns { username, firstName, lastName, isAdmin, jobs }
     *   where jobs is { id, date_of_walk, time_of_walk, pet_ids, status, created_at }
     *
     * Throws NotFoundError if user not found.
    **/

    static async get(username) {
        const userRes = await db.query(
            `SELECT username,
                  u.first_name AS "firstName",
                  u.last_name AS "lastName",
                  u.email,
                  u.city,
                  u.state,
                  u.zipcode,
                  u.role,
                  u.is_admin AS "isAdmin",
                  w.id AS "walkerId"
           FROM users u
           JOIN walkers w ON u.id = w.user_id
           WHERE username = $1`,
            [username],
        );

        const user = userRes.rows[0];
        console.log(user)


        if (!user) throw new NotFoundError(`No walker: ${username}`);

        /**
         * Jobs that the walker applied to. Will return job_id
        */

        const walkerAppliedJobs = await db.query(
            `SELECT job_id
           FROM applied_jobs 
           WHERE walker_id = $1`, [user.walkerId]);


        user.appliedJobsId = walkerAppliedJobs.rows.map(job => job.job_id);

        return user;
    }

}

module.exports = Walker;