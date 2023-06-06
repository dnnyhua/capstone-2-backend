"use strict";
const db = require("../db");
const { NotFoundError } = require("../expressError");


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
            `SELECT 
                id,
                owner_id AS "ownerId",
                gender,
                age,
                breed,
                weight,
                friendly_w_other_dogs AS "friendlyWithOtherDogs",
                friendly_w_children AS "friendlyWithChildren",
                img,
                additional_details AS "additionalDetails"
            FROM pets
            WHERE owner_id =$1`,
            [user.ownerId]
        );
        user.pets = ownerPets.rows


        // id serial PRIMARY KEY,
        // owner_id INTEGER,
        // name TEXT NOT NULL,
        // gender TEXT NOT NULL,
        // age INTEGER,
        // breed TEXT NOT NULL,
        // weight INTEGER NOT NULL,
        // size TEXT,
        // friendly_w_other_dogs boolean,
        // friendly_w_children boolean,
        // img TEXT null,
        // additional_details TEXT,
        // created_at TIMESTAMP DEFAULT NOW(),
        // FOREIGN KEY (owner_id) REFERENCES owners(id)
        // ON DELETE CASCADE


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