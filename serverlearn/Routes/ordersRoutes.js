// Routes/ordersRoutes.js
const express = require("express");
const {
  createOrder,
  readOrders,
  getOrdersAdmin,
  updateStatusOrder,
} = require("../Controllers/orderController");
const router = express.Router();
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param } = require("express-validator");
const { orderValidationRules } = require("../validations/orderValidation");

// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---
router.post("/orders", orderValidationRules, authCheck, createOrder);
router.get("/orders/user-orders", authCheck, readOrders);

// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---
router.get("/orders", authCheck, isAdmin, getOrdersAdmin);
router.patch("/orders/:id", authCheck, isAdmin, updateStatusOrder);
module.exports = router;
