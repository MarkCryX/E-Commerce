// Routes/ordersRoutes.js
const express = require("express");
const {
  createOrder,
  readOrders,
  getOrdersAdmin,
  updateStatusOrder,
  genQRCodeForOrder,
  uploadPaymentSlip,
} = require("../Controllers/orderController");
const router = express.Router();
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param } = require("express-validator");
const { orderValidationRules } = require("../validations/orderValidation");

// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---
router.post("/orders", orderValidationRules, authCheck, createOrder);
router.get("/orders/user-orders", authCheck, readOrders);
router.get("/orders/qrcode/:id", authCheck, genQRCodeForOrder);
router.patch("/orders/:id/payment-slip", authCheck, uploadPaymentSlip);

// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---
router.get("/orders", authCheck, isAdmin, getOrdersAdmin);
router.patch("/orders/:id", authCheck, isAdmin, updateStatusOrder);
module.exports = router;
