const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

router.get("/:driverId", vehicleController.getVehicleByDriverId);

module.exports = router;
