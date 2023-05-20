"use strict";
const db = require("../db");
const bcrypt = require("bcrypt");
// const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Related functions for users. */

class User {

    /** authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/

    static async authenticate(username, password) {
        // try to find the user first
        const result = await db.query(
            `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  role,
                  is_admin AS "isAdmin"
           FROM users
           WHERE username = $1`,
            [username],
        );

        const user = result.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid username/password");
    }

    /** Register user with data.
     *
     * Returns { username, firstName, lastName, email, role }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async register(
        { username, password, firstName, lastName, email, role, isAdmin, city, state, zipcode }) {
        const duplicateCheck = await db.query(
            `SELECT username
         FROM users
         WHERE username = $1`,
            [username],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
                (username,
                password,
                first_name,
                last_name,
                email,
                role,
                is_admin,
                city,
                state,
                zipcode)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING username, first_name AS "firstName", last_name AS "lastName", email, role, is_admin AS "isAdmin", city, state, zipcode`,
            [
                username,
                hashedPassword,
                firstName,
                lastName,
                email,
                role,
                isAdmin,
                city,
                state,
                zipcode
            ],
        );


        // need to update owners or walkers table
        const newlyAddedUser = await db.query(
            `SELECT id, role
                FROM users
                WHERE username = $1`,
            [username],
        );


        await db.query(
            `INSERT INTO ${newlyAddedUser.rows[0].role === "dog owner" ? "owners" : "walkers"}
                (user_id)
            VALUES ($1)
            RETURNING user_id`,
            [
                newlyAddedUser.rows[0].id
            ],
        );


        const user = result.rows[0];
        return user;
    }

    /** Find all users.
       *
       * Returns [{ username, first_name, last_name, email, is_admin }, ...]
       **/

    static async findAll() {
        const result = await db.query(
            `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  role,
                  is_Admin AS "isAdmin",
                  city,
                  state,
                  zipcode
           FROM users
           ORDER BY username`,
        );

        return result.rows;
    }


}








module.exports = User;
