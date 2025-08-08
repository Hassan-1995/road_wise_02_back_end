// routes/tripRoutes.js
const express = require("express");
const router = express.Router();
const pathController = require("../controllers/pathController");

router.patch("/", pathController.updateTripStatusOrEndTime);

module.exports = router;
