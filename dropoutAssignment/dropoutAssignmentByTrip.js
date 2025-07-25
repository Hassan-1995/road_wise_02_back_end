const express = require("express");
const router = express.Router();
const dropoutAssignment = require("../controllers/dropoutAssignmentController");

router.get("/:tripId", dropoutAssignment.getDropoutAssignmentByTrip);

module.exports = router;
