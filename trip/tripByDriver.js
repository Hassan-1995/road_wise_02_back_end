const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

router.get("/:driverId", tripController.getTripsByDriver);

module.exports = router;
