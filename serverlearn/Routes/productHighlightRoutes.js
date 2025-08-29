const express = require("express");
const { getNewArrivals } = require("../Controllers/highlightProductController");
const router = express.Router();
const { apiLimiter } = require("../Middleware/rateLimiter");


// --- Public Endpoints (สำหรับสาธารณะ) ---
router.get("/products/highlight/new-arrivals",apiLimiter, getNewArrivals);


module.exports = router;