"use strict";
const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError } = require("../expressError");



class Job {

    /**
     * Returns {date, time, pet_ids, pet_sizes, owner_id, status} 
     * 
     * 
    */

    static async findAll({ city, state, zipcode } = {}) {
        console.log(city)
        console.log(state)
        console.log(zipcode)

        // console.log(pet_sizes)

        // let query = `SELECT id,
        //                     to_char(date::timestamp, 'YYYY-MM-DD') AS date,
        //                     time at time zone 'pst' AS time,
        //                     pet_ids AS "petIds",
        //                     owner_id AS "ownerId",
        //                     city,
        //                     state,
        //                     zipcode, 
        //                     status,
        //                     duration
        //             FROM jobs`

        // let whereExpressions = [];
        // let queryValues = [];

        // // if (pet_sizes !== undefined) {
        // //     queryValues.push(`%${pet_sizes}%`)
        // //     whereExpressions.push(`pet_sizes ILIKE $${queryValues.length}`);
        // // }

        // if (whereExpressions.length > 0) {
        //     query += " WHERE " + whereExpressions.join(" AND ");
        // }

        // console.log(query)
        // const jobsRes = await db.query(query, queryValues)
        // console.log(jobsRes.rows)
        // return jobsRes.rows



        let query = `SELECT id,
                to_char(date::timestamp, 'YYYY-MM-DD') AS date,
                time at time zone 'pst' AS time,
                pet_ids AS "petIds",
                owner_id AS "ownerId",
                city,
                state,
                zipcode, 
                status,
                duration
        FROM jobs`

        let whereExpressions = [];
        let queryValues = [];

        // if (pet_sizes !== undefined) {
        //     queryValues.push(`%${pet_sizes}%`)
        //     whereExpressions.push(`pet_sizes ILIKE $${queryValues.length}`);
        // }

        if (city !== undefined) {
            queryValues.push(city)
            whereExpressions.push(`city = $${queryValues.length}`)
        }

        if (state !== undefined) {
            queryValues.push(state)
            whereExpressions.push(`state = $${queryValues.length}`)
        }

        if (zipcode !== undefined) {
            queryValues.push(zipcode)
            whereExpressions.push(`zipcode = $${queryValues.length}`)
        }

        if (whereExpressions.length > 0) {
            query += " WHERE " + whereExpressions.join(" AND ");
        }

        console.log(query)
        const jobsRes = await db.query(query, queryValues)
        console.log(jobsRes.rows)
        return jobsRes.rows
    }


    /**
    * find job posting based on job Id
    */
    static async findByJobId(id) {
        const res = await db.query(`SELECT id,
                            to_char(date::timestamp, 'YYYY-MM-DD') AS date,
                            time,
                            pet_ids AS "petIds",
                            owner_id AS "ownerId", 
                            duration,
                            status,
                            address,
                            city,
                            state,
                            zipcode
                    FROM jobs
                    WHERE id = $1
                    ORDER BY date, time `, [id]);
        return res.rows
    }


    /**
    * find job posting based on owner Id
    */
    static async findByOwnerId(id) {
        const res = await db.query(`SELECT id,
                            to_char(date::timestamp, 'YYYY-MM-DD') AS date,
                            time,
                            pet_ids as "petIds",
                            owner_id AS "ownerId", 
                            duration,
                            status
                    FROM jobs
                    WHERE owner_id = $1
                    ORDER BY date, time `, [id]);


        return res.rows
    }


    /**
    * find job posting based on Pet Id; this will be for pet profile
    */
    static async findByPetId(id) {
        const res = await db.query(
            `SELECT id,
                            to_char(date::timestamp, 'YYYY-MM-DD') AS date,
                            time,
                            pet_ids as "petIds",
                            owner_id AS "ownerId", 
                            duration,
                            status
                    FROM jobs
                    WHERE pet_ids LIKE '%' || $1 || '%'
                    ORDER BY date, time `, [id]);
        return res.rows
    }

    /**
     *  Create new job posting
     * 
     */
    static async create({ date, time, duration, petIds, ownerId, address, city, state, zipcode }) {
        const result = await db.query(
            `INSERT INTO jobs
                   (date, 
                    time,
                    duration,
                    pet_ids, 
                    owner_id,
                    address, 
                    city, 
                    state, 
                    zipcode
                )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id AS "jobId", date, time, duration, pet_ids AS "petIds", owner_id AS "ownerId", address, city, state, zipcode`,
            [
                date,
                time,
                duration,
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


    /** Apply for job: update db, returns undefined.
       *
       * - username: username applying for job
       * - jobId: job_id
       **/
    static async apply({ walkerId }, jobId) {
        // Check if job id exists
        const preCheck = await db.query(
            `SELECT id
                 FROM jobs
                 WHERE id = $1`, [jobId]);
        const job = preCheck.rows[0]

        if (!job) throw new NotFoundError(`No job: ${jobId}`);

        // Check if user exists
        const preCheck2 = await db.query(
            `SELECT id
                FROM walkers
                WHERE id = $1`, [walkerId]);
        const user = preCheck2.rows[0];

        if (!user) throw new NotFoundError(`Walker not found`);

        // update applied_jobs table
        await db.query(
            `INSERT INTO applied_jobs (
                job_id,
                walker_id
            )
            VALUES ($1, $2)`,
            [jobId, walkerId]
        )

        // update jobs table so that owner know to review the application(s). Status: Pending Walker -> Pending Review
        await db.query(
            `UPDATE jobs
            SET status = 'Pending Review'
            WHERE id = $1`,
            [jobId]
        )
    }

    static async applications(jobId) {
        const res = await db.query(
            `SELECT 
                id, 
                job_id AS "jobId", 
                walker_id AS "walkerId",
                first_name AS "firstName",
                last_name AS "lastName",
                rate_per_30min AS "ratePer30min",             
                status
                FROM applied_jobs
                WHERE job_id IN ($1)`,
            [jobId]
        )

        const applications = res.rows
        return applications
    }

    static async hireWalker(jobId, walkerId) {

        //update jobs table
        await db.query(
            `UPDATE jobs
            SET status = 'Walker Hired'
            WHERE id = $1`,
            [jobId]
        )

        // update applied_jobs table for walker who got hired
        await db.query(
            `UPDATE applied_jobs
            SET STATUS = 'Hired'
            WHERE job_id = $1 AND walker_id = $2`,
            [jobId, walkerId]
        )

        // update applied_jobs table; this will update status for walkers not hired
        await db.query(
            `Update applied_jobs
            SET status = 'Job has been filled'
            WHERE job_id IN ($1) AND walker_id NOT IN ($2)`,
            [jobId, walkerId]
        )
    }

    static async rejectWalker(jobId, walkerId) {
        console.log(jobId)
        await db.query(
            `UPDATE applied_jobs
            SET status = 'Job has been filled'
            WHERE job_id IN ($1) AND walker_id IN ($2)`,
            [jobId, walkerId]
        )
    }


    static async getHiredWalker(jobId) {
        const res = await db.query(
            `SELECT 
                job_id AS "jobId", 
                walker_id AS "walkerId",
                first_name AS "firstName",
                last_name AS "lastName",
                rate_per_30min AS "ratePer30min",             
                status
            FROM applied_jobs
            WHERE job_id = $1 AND status = 'Hired'`,
            [jobId]
        )
        return res.rows[0]
    }

    static async getAppliedJobs(walkerId) {

        const res = await db.query(
            `SELECT
                job_id
            FROM applied_jobs
            WHERE walker_id = $1`,
            [walkerId]
        )

        const jobIdsArray = res.rows.map(row => row.job_id);

        const result = await db.query(
            `SELECT  
                jobs.id,
                to_char(date::timestamp, 'YYYY-MM-DD') AS date,
                time,
                pet_ids AS "petIds",
                owner_id AS "ownerId", 
                duration,
                applied_jobs.status
            FROM jobs 
            INNER JOIN applied_jobs ON jobs.id = applied_jobs.job_id
            WHERE jobs.id = ANY($1::int[]) AND applied_jobs.walker_id = $2`,
            [jobIdsArray, walkerId]
        )

        console.log(result.rows)
        return result.rows
    }

    static async checkJobStatus(walkerId, JobId) {
        const res = await db.query(
            `SELECT 
                job_id,
                status
            FROM applied_jobs
            WHERE walker_id = $1 AND job_id = $2`,
            [walkerId, JobId]
        )
        console.log(res.rows[0])
        return res.rows[0]
    }
}

module.exports = Job;


