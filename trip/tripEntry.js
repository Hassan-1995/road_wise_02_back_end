const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

router.post("/", tripController.createNewTrip);

module.exports = router;
