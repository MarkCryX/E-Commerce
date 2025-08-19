const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../Controllers/dashboardController");
const { authCheck, isAdmin } = require("../Middleware/authcheck");


router.get("/dashboard/stats/summary", authCheck, isAdmin, getDashboardStats)


module.exports = router;
