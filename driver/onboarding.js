const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

router.post("/", driverController.onboradDriver);

module.exports = router;
