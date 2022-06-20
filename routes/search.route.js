const express = require("express");
let router = express.Router();
const { validationResult, body, param } = require("express-validator")
const utilities = require('../utilities/auth.js');
const searchController = require('../controllers/search.controller.js');

router.route("/price").get(
    body("price").isNumeric().notEmpty(),
    (req, res) =>{
        const errors = validationResult(req);
        if(errors.isEmpty()){
            searchController.findHousesByPrice(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() })
        }
    }
)

router.route("/location").get(
    body("location").isString().notEmpty(),
    (req, res) =>{
        const errors = validationResult(req);
        if(errors.isEmpty()){
            searchController.findHousesByLocation(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() })
        }
    }
)

router.route("/availability").get(
    (req, res) =>{
        const errors = validationResult(req);
        if(errors.isEmpty()){
            searchController.findHousesByAvailability(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() })
        }
    }
)

router.route("/rating").get(
    body("rating").isNumeric().notEmpty(),
    (req, res) =>{
        const errors = validationResult(req);
        if(errors.isEmpty()){
            searchController.findHousesByRating(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() })
        }
    }
)

module.exports = router;