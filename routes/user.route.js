const express = require("express");
let router = express.Router();
const { validationResult, body, param } = require("express-validator")
const utilities = require('../utilities/auth.js');
const userController = require('../controllers/user.controller.js');
const authController = require('../controllers/auth.controller.js');


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

router.route("/login").post(
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            userController.logIn(req, res);
        } else{
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/findAllUsers").get(
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            authController.verifyToken(req, res);
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
            authController.verifyToken(req, res);
            userController.changeBlock(req, res);
        } else {
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/createEvent").post(
    body("location").isString().notEmpty(),
    body("date").isString().notEmpty(),
    body("eventType").isString().notEmpty(),
    (req, res) => {
        const errors = validationResult(req, res);
        if(errors.isEmpty()){
            authController.verifyToken(req, res);
            userController.createEvent(req, res);
        } else {
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/approveEvent").put(
    body("eventoToApprove").isNumeric().notEmpty(),
    body("approve").isBoolean().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            authController.verifyToken(req, res);
            userController.approveEvent(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() })
        }
    }
)

router.route("/createHouse").post(
    body("location").notEmpty(),
    body("description").notEmpty(),
    body("priceTag").isNumeric().notEmpty(),
    body("rooms").isNumeric().notEmpty(),
    body("roomType").isNumeric().notEmpty(),
    (req, res) => {
        const errors = validationResult(req, res);
        if(errors.isEmpty()){
            authController.verifyToken(req, res);
            userController.createHouse(req, res);
        } else {
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/changeAvailability").put(
    body("house").isNumeric().notEmpty(),
    body("available").isBoolean().notEmpty(),
    (req, res) => {
        const errors = validationResult(req, res);
        if(errors.isEmpty()){
            authController.verifyToken(req, res);
            userController.changeHouseAvailability(req, res);
        } else {
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/applyToHouse").post(
    body("house").isNumeric().notEmpty(),
    (req, res) => {
        const errors = validationResult(req, res);
        if(errors.isEmpty()){
            authController.verifyToken(req, res);
            userController.applyToHouse(req, res);
        } else {
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/findApplications").get(
    body("house").isNumeric().notEmpty(),
    (req, res) => {
        const errors = validationResult(req, res);
        if(errors.isEmpty()){
            authController.verifyToken(req, res);
            userController.findApplications(req, res);
        } else {
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/approveApplication").put(
    body("house").isNumeric().notEmpty(),
    body("userID").isNumeric().notEmpty(),
    body("approve").isBoolean().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            authController.verifyToken(req, res);
            userController.approveApplication(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() });
        }
    }
)

router.route("/housesToApprove").get(
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            authController.verifyToken(req, res);
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
    body("houseToApprove").isNumeric().notEmpty(),
    body("approve").isBoolean().notEmpty(),
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            authController.verifyToken(req, res);
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
    body("houseID").isNumeric().notEmpty(),
    body("rating").isNumeric().notEmpty(),
    body("comment"),
    (req, res) => {
        const errors = validationResult(req);
        if(errors.isEmpty()){
            authController.verifyToken(req, res);
            userController.rateHouse(req, res);
        }
        else{
            res.status(404).json({ errors: errors.array() })
        }
    }
)

module.exports = router;