"use strict";
const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");


class Pet {

    /** 
     * return information of all pets
     * 
     * */
    static async findAll() {

        const result = await db.query(
            `SELECT * FROM pets`
        )
        return result.rows
    }


    // get info on pet with pet_id
    static async get(id) {
        const result = await db.query(
            `SELECT * FROM pets
            WHERE id = $1`,
            [id]
        )
        return result.rows
    }

    // get info on pet with array of pet_ids
    static async getMultiPets(ids) {
        const result = await db.query(
            `SELECT * FROM pets
            WHERE id = ANY($1::int[])`,
            [ids]
        )
        return result.rows
    }


    // Add new pet

    static async add({ ownerId, name, breed, gender, age, weight, friendlyWithDogs, friendlyWithChildren, img, additionalDetails }) {
        const result = await db.query(
            `INSERT INTO pets
                (owner_id,
                 name,
                 breed,
                 gender,
                 age,
                 weight,
                 friendly_w_other_dogs,
                 friendly_w_children,
                 img, 
                 additional_details)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, owner_id AS "ownerId", name, breed, gender, age, weight, friendly_w_other_dogs AS "friendlyWithDogs", friendly_w_children AS "friendlyWithChildren", img, additional_details AS "additionalDetails"`,
            [ownerId,
                name,
                breed,
                gender,
                age,
                weight,
                friendlyWithDogs,
                friendlyWithChildren,
                img,
                additionalDetails
            ]
        )
        const pet = result.rows[0]
        return pet;
        ;
    }




}


module.exports = Pet;
