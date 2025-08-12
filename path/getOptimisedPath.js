const express = require("express");
const router = express.Router();
const pathController = require("../controllers/pathController");

router.get("/:tripID", pathController.getOptimisedPath);

module.exports = router;
