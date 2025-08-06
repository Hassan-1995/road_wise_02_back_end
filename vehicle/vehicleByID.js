const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

router.get("/:vehicleID", vehicleController.getVehicleByID);

module.exports = router;
