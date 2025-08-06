const express = require("express");
const router = express.Router();
const dropoutAssignment = require("../controllers/dropoutAssignmentController");

router.put(
  "/:driverId/store/:storeId/trip/:tripId",
  dropoutAssignment.updateStoreStatusbyDriver
);

module.exports = router;
