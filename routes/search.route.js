const express = require("express");
let router = express.Router();
const { validationResult, body, param } = require("express-validator")
const utilities = require('../utilities/auth.js');
const searchController = require('../controllers/search.controller.js');


router.route("/rating").get(
    body("rating").isNumeric().notEmpty(),
    (req, res) =>{
        const errors = validationResult(req);
        if(errors.isEmpty()){

        }
        else{
            res.status(404).json({ errors: errors.array() })
        }
    }
)

module.exports = router;