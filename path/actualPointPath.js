const express = require("express");
const router = express.Router();
const pathController = require("../controllers/pathController");

router.post("/", pathController.insertActualPathPoint);

module.exports = router;
