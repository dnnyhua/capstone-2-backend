"use strict";
const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const { NotFoundError } = require("../expressError");
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
            `SELECT
                id,
                owner_id AS "ownerId",
                name,
                gender,
                age,
                breed,
                weight,
                friendly_w_other_dogs AS "friendlyWithOtherDogs",
                friendly_w_children AS "friendlyWithChildren",
                img,
                additional_details AS "additionalDetails"
            FROM pets
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
        console.log(result)
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


    // Update Pet's profile

    static async update(id, data) {
        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                friendlyWithOtherDogs: "friendly_w_other_dogs",
                friendlyWithChildren: "friendly_w_children",
                additionalDetails: "additional_details",
            });

        const petIdIdx = "$" + (values.length + 1);
        const querySql = `UPDATE pets 
                      SET ${setCols} 
                      WHERE id = ${petIdIdx}
                      RETURNING id,
                                name,
                                gender,
                                age,
                                breed,
                                weight,
                                friendly_w_other_dogs AS "friendlyWithOtherDogs",
                                friendly_w_children AS "friendlyWithChildren",
                                additional_details AS "additionalDetails"`;
        const result = await db.query(querySql, [...values, id]);
        const pet = result.rows[0];

        if (!pet) throw new NotFoundError(`The pet's info you are trying to udpate does not exist`);

        return pet;
    }



    static async remove(id, petName) {
        const result = await db.query(
            `DELETE 
                FROM pets
                WHERE id = $1 AND name = $2
                RETURNING id, name`,
            [id, petName]
        )

        const pet = result.rows[0];

        if (!pet) throw new NotFoundError(`No user: ${petName}`);

    }
}


module.exports = Pet;