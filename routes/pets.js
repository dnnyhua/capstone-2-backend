"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

const Job = require("../models/job");
const Pet = require("../models/pet");

const router = express.Router();



/**
 * GET 
 * returns all registered pets
 * 
 */

router.get("/", async function (req, res, next) {
    try {
        const pets = await Pet.findAll();
        console.log(pets)
        return res.json({ pets });
    } catch (err) {
        return next(err);
    }

})


/**
 * POST
 * 
 * Add new pet
 * 
 */

router.post("/", async function (req, res, next) {
    try {
        const pet = await Pet.add(req.body);
        return res.status(201).json({ pet });
    } catch (err) {
        return next(err);
    }
})


router.get("/ids", async function (req, res, next) {
    try {
        const petIds = JSON.parse(req.query.petIds);
        const pets = await Pet.getMultiPets(petIds);

        return res.json({ pets });
    } catch (err) {
        return next(err);
    }
})











module.exports = router

