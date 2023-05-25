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

    static async findAll({ } = {}) {
        // console.log(pet_sizes)

        let query = `SELECT id,
                            to_char(date::timestamp, 'YYYY-MM-DD') AS date,
                            time at time zone 'pst' AS time,
                            pet_ids,
                            owner_id AS ownerId, 
                            status
                    FROM jobs`

        let whereExpressions = [];
        let queryValues = [];

        // if (pet_sizes !== undefined) {
        //     queryValues.push(`%${pet_sizes}%`)
        //     whereExpressions.push(`pet_sizes ILIKE $${queryValues.length}`);
        // }

        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
        }

        console.log(query)
        const jobsRes = await db.query(query, queryValues)
        console.log(jobsRes.rows)
        return jobsRes.rows
    }


    static async create({ date, time, petIds, ownerId, address, city, state, zipcode }) {
        // const owner_Id = await db.query(
        //     `SELECT o.id
        //         FROM owners o 
        //         JOIN users u ON o.user_id = u.id
        //         WHERE username = $1`,
        //     [username]
        // );

        const result = await db.query(
            `INSERT INTO jobs
                   (date, 
                    time, 
                    pet_ids, 
                    owner_id,
                    address, 
                    city, 
                    state, 
                    zipcode
                )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id AS "jobId", date, time, pet_ids AS "petIds", owner_id AS "ownerId", address, city, state, zipcode`,
            [
                date,
                time,
                petIds,
                ownerId,
                address,
                city,
                state,
                zipcode
            ],
        );

        const job = result.rows[0];
        return job;

    }



    /** Update job data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { title, salary, equity }
   *
   * Returns { id, title, salary, equity, companyHandle }
   *
   * Throws NotFoundError if not found.
   */

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            { petIds: "pet_ids" });
        const idVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE jobs 
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id, 
                                date, 
                                time,
                                pet_ids AS "petIds",
                                address,
                                city,
                                state,
                                zipcode`;
        const result = await db.query(querySql, [...values, id]);
        const job = result.rows[0];
        console.log(job)
        if (!job) throw new NotFoundError(`No job: ${id}`);

        return job;


    }

    /** Delete given job from database;.
     *
     * Throws NotFoundError if job not found.
     **/

    static async remove(id) {
        const result = await db.query(
            `DELETE
             FROM jobs
             WHERE id = $1
             RETURNING id`, [id]);
        const job = result.rows[0];

        if (!job) throw new NotFoundError(`No job: ${id}`);
    }

}

module.exports = Job;
