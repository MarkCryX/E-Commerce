// Routes/usersRoutes.js
const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateAddress,
  updateisDefaultAddress,
  createAddress,
  deleteAddress,
} = require("../Controllers/userController");
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param } = require("express-validator");
const router = express.Router();
const { addressValidationRules } = require("../validations/addressValidation");

// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---

router.post(
  "/users/me/address",
  addressValidationRules,
  authCheck,
  createAddress
);

router.put(
  "/users/me/address/:addressId",
  [[param("addressId").isMongoId()]],
  addressValidationRules,
  authCheck,
  updateAddress
);

router.put(
  "/users/me/address/default/:addressId",
  [param("addressId").isMongoId().withMessage("addressId ไม่ถูกต้อง")],
  authCheck,
  updateisDefaultAddress
);

router.delete(
  "/users/me/address/:addressId",
  [param("addressId").isMongoId().withMessage("addressId ไม่ถูกต้อง")],
  authCheck,
  deleteAddress
);

// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---

router.get("/admin/users", authCheck, isAdmin, getAllUsers);

router.get(
  "/admin/users/:id",
  [param("id").isMongoId().withMessage("ID ผู้ใช้ไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  getUserById
);

module.exports = router;
