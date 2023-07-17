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
     * Returns { username, firstName, lastName, email, role, isAdmin, city, state, zipcode }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async register(
        { username, password, firstName, lastName, email, role, isAdmin, address, city, state, zipcode, profileImage, bio, rate }) {
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
                address,
                city,
                state,
                zipcode,
                profile_image,
                bio,
                rate)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING id AS "userId", username, first_name AS "firstName", last_name AS "lastName", email, role, is_admin AS "isAdmin", address, city, state, zipcode, profile_image AS "profileImage", bio, rate`,
            [
                username,
                hashedPassword,
                firstName,
                lastName,
                email,
                role,
                isAdmin,
                address,
                city,
                state,
                zipcode,
                profileImage,
                bio,
                rate
            ],
        );

        const newAddedUser = result.rows[0];

        // Logic to update owners or walkers table
        const res = await db.query(
            `INSERT INTO ${newAddedUser.role === "dog owner" ? "owners" : "walkers"}
                (user_id)
            VALUES ($1)
            RETURNING id`,
            [
                newAddedUser.userId
            ],
        );

        const secondaryId = res.rows[0].id

        newAddedUser.role === "dog owner" ? newAddedUser.ownerId = secondaryId : newAddedUser.walkerId = secondaryId

        console.log(newAddedUser)
        return newAddedUser;
    }

    /** Find all users.
       *
       * Returns [{ username, first_name, last_name, email, is_admin }, ...]
       **/

    static async findAll() {
        const result = await db.query(
            `SELECT id,
                  username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  role,
                  is_Admin AS "isAdmin",
                  address,
                  city,
                  state,
                  zipcode,
                  profile_image AS "profileImage"
           FROM users
           ORDER BY username`,
        );
        return result.rows;
    }


    /** Find user with given username.
       *
       * Returns [{ username, first_name, last_name, email, is_admin }, ...]
       **/

    static async getUser(username) {
        const result = await db.query(
            `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  profile_image AS "profileImage",
                  role,
                  is_Admin AS "isAdmin",
                  address,
                  city,
                  state,
                  zipcode,
                  bio,
                  rate
           FROM users
           WHERE username = $1`,
            [username]
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);
        return user;

    }

    /** Update user data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include:
   *   { firstName, lastName, password, email, isAdmin }
   *
   * Returns { username, firstName, lastName, email, isAdmin }
   *
   * Throws NotFoundError if not found.
   *
   * WARNING: this function can set a new password or make a user an admin.
   * Callers of this function must be certain they have validated inputs to this
   * or a serious security risks are opened.
   */

    static async update(username, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name",
                isAdmin: "is_admin",
                profileImage: "profile_image"
            });
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                is_admin AS "isAdmin",
                                address,
                                city,
                                state,
                                zipcode,
                                profile_image AS "profileImage"`;
        const result = await db.query(querySql, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }


    /** Delete given user from database */

    static async remove(username) {
        let result = await db.query(
            `DELETE
            FROM users
            WHERE username = $1
            RETURNING username`,
            [username],
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);
    }
}






module.exports = User;
