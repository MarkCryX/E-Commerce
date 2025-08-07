const express = require("express");
const { getNewArrivals } = require("../Controllers/highlightProductController");
const router = express.Router();

router.get("/new-arrivals", getNewArrivals);


module.exports = router;