const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../Controllers/dashboardController");
const { authCheck, isAdmin } = require("../Middleware/authcheck");

// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---
router.get("/admin/dashboard/stats/summary", authCheck, isAdmin, getDashboardStats)


module.exports = router;
