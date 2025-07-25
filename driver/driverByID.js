const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

router.get("/:driverID", driverController.getDriverByID);

module.exports = router;
