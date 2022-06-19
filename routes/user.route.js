const express = require("express");
let router = express.Router();
const { validationResult, body, param } = require("express-validator")
const utilities = require('../utilities/auth.js');
const userController = require('../controllers/user.controller.js');

router.route("/register").post(
  body("name").notEmpty().escape(),
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty().escape(),
  body("userType").notEmpty(),
  (req, res) => {
      const errors = validationResult(req);
      if (errors.isEmpty()) {
          userController.register(req, res);
      } else {
          res.status(404).json({ errors: errors.array() });
      }
  }
)

router.route("/findAllUsers").get(
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            userController.findAll(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/getUser").get(
    body("id").isNumeric().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            userController.findOne(req, res);
        } else {
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/changeBlock").put(
    body("adminID").isNumeric().notEmpty(),
    body("otherUserID").isNumeric().notEmpty(),
    body("isBlocked").isBoolean().notEmpty(),
    (req, res) => {
        const errors = validationResult(req, res);
        if(errors.isEmpty()){
            userController.changeBlock(req, res);
        } else {
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/createHouse").post(
    body("creatorID").isNumeric().notEmpty(),
    body("location").notEmpty(),
    body("description").notEmpty(),
    body("priceTag").isNumeric().notEmpty(),
    body("rooms").isNumeric().notEmpty(),
    body("roomType").isNumeric().notEmpty(),
    (req, res) => {
        const errors = validationResult(req, res);
        if(errors.isEmpty()){
            userController.createHouse(req, res);
        } else {
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/housesToApprove").get(
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            userController.findHousesToApprove(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/housesApproved").get(
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            userController.findApprovedHouses(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/approveHouse").put(
    body("adminID").isNumeric().notEmpty(),
    body("houseToApprove").isNumeric().notEmpty(),
    body("approve").isBoolean().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            userController.approveHouse(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() })
        }
    }
)

router.route("/houseRatings").get(
    body("houseID").isNumeric().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            userController.getHouseRatings(req, res);
        } else{
            res.status(404).json({ errors: errors.array() })
        }
    }
)

router.route("/rateHouse").post(
    body("userID").isNumeric().notEmpty(),
    body("houseID").isNumeric().notEmpty(),
    body("rating").isNumeric().notEmpty(),
    body("comment"),
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            userController.rateHouse(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() })
        }
    }
)

module.exports = router;