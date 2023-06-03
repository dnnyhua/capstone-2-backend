"use strict";
const db = require("../db");
const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");


class Owner {


    /** Given a username, return data about owner.
     *
     * Returns { username, firstName, lastName, role, city, state, zipcode, isAdmin, ownerId, jobPostings }
     *   where jobPostings is [A LIST OF JOB IDs]
     *
     * Throws NotFoundError if user not found.
    **/

    static async get(username) {
        const userRes = await db.query(
            `SELECT o.id AS "ownerId"
           FROM users u
           JOIN owners o ON u.id = o.user_id
           WHERE username = $1`,
            [username],
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No owner: ${username}`);

        const ownerPets = await db.query(
            `SELECT id, name, img
            FROM pets
            WHERE owner_id =$1`,
            [user.ownerId]
        );
        user.pets = ownerPets.rows

        const ownerJobPostings = await db.query(
            `SELECT id
           FROM jobs
           WHERE owner_id = $1`,
            [user.ownerId]);

        user.jobPostings = ownerJobPostings.rows.map(job => job.id);

        return user;
    }



}

module.exports = Owner;