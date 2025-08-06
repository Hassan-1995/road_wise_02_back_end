const express = require("express");
const router = express.Router();
const dropoutAssignmentController = require("../controllers/dropoutAssignmentController");

router.post("/", dropoutAssignmentController.createNewDropoffs);

module.exports = router;
