const express = require("express");
const router = express.Router();
const liveDriverPosition = require("../controllers/liveTrackerController");

router.get("/", liveDriverPosition.getAllLivePosition);

module.exports = router;
