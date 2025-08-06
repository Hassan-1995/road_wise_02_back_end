const express = require("express");
const router = express.Router();
const storeRoutes = require("../controllers/storeController");

router.get("/", storeRoutes.getAllStore);

module.exports = router;
