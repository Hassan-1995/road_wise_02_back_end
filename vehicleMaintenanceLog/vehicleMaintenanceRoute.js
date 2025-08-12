const express = require("express");
const router = express.Router();
const vehicleMaintenanceController = require("../controllers/vehicleMaintenanceLogController");

router.get("/", vehicleMaintenanceController.getVehicleMaintenanceLogID);

module.exports = router;
