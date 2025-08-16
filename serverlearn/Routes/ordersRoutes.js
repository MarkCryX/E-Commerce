// Routes/ordersRoutes.js
const express = require("express");
const {
  createOrder,
  readOrders,
  getOrdersAdmin,
  updateStatusOrder,
  genQRCodeForOrder,
  uploadPaymentSlip,
  updatePaymemtStatus,
  completeOrder,
  getOrdersCompleted,
} = require("../Controllers/orderController");
const router = express.Router();
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param } = require("express-validator");
const { orderValidationRules } = require("../validations/orderValidation");

// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---
router.post("/orders", orderValidationRules, authCheck, createOrder);
router.get("/orders/user-orders", authCheck, readOrders);

router.get(
  "/orders/qrcode/:id",
  [param("id").isMongoId().withMessage("ID คำสั่งซื้อไม่ถูกต้อง")],
  authCheck,
  genQRCodeForOrder
);

router.patch(
  "/orders/:id/payment-slip",
  [param("id").isMongoId().withMessage("ID คำสั่งซื้อไม่ถูกต้อง")],
  authCheck,
  uploadPaymentSlip
);


// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---
router.get("/orders", authCheck, isAdmin, getOrdersAdmin);

router.get("/orders/complete", authCheck, isAdmin, getOrdersCompleted)

router.patch(
  "/orders/:id/status",
  [param("id").isMongoId().withMessage("ID คำสั่งซื้อไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  updateStatusOrder
);

router.patch(
  "/orders/:id/payment-status",
  [param("id").isMongoId().withMessage("ID คำสั่งซื้อไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  updatePaymemtStatus
);

router.patch(
  "/orders/:id/complete",
  [param("id").isMongoId().withMessage("ID คำสั่งซื้อไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  completeOrder
);

module.exports = router;
