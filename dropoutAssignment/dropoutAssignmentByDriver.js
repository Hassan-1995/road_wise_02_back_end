const express = require("express");
const router = express.Router();
const dropoutAssignment = require("../controllers/dropoutAssignmentController");

router.get("/:driverId", dropoutAssignment.getDropoutAssignmentByDriver);

module.exports = router;
