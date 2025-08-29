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
} = require("../Controllers/orderController");
const router = express.Router();
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { param } = require("express-validator");
const { orderValidationRules } = require("../validations/orderValidation");
const { apiLimiter } = require("../Middleware/rateLimiter");


// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---
router.post("/orders",apiLimiter, orderValidationRules, authCheck, createOrder);
router.get("/orders/user-orders",apiLimiter, authCheck, readOrders);

router.get(
  "/orders/qrcode/:id",
  apiLimiter,
  [param("id").isMongoId().withMessage("ID คำสั่งซื้อไม่ถูกต้อง")],
  authCheck,
  genQRCodeForOrder
);

router.patch(
  "/orders/:id/payment-slip",
  apiLimiter,
  [param("id").isMongoId().withMessage("ID คำสั่งซื้อไม่ถูกต้อง")],
  authCheck,
  uploadPaymentSlip
);


// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---
router.get("/admin/orders", authCheck, isAdmin, getOrdersAdmin);

router.patch(
  "/admin/orders/:id/status",
  [param("id").isMongoId().withMessage("ID คำสั่งซื้อไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  updateStatusOrder
);

router.patch(
  "/admin/orders/:id/payment-status",
  [param("id").isMongoId().withMessage("ID คำสั่งซื้อไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  updatePaymemtStatus
);

router.patch(
  "/admin/orders/:id/complete",
  [param("id").isMongoId().withMessage("ID คำสั่งซื้อไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  completeOrder
);

module.exports = router;
