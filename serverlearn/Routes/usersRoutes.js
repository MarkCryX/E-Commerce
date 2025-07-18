// Routes/usersRoutes.js
const express = require("express");
const {
  register,
  login,
  getAllUsers,
  getUserById,
  checkAuthStatus,
  logout,
  refreshAccessToken,
  hasToken,
  updateAddress,
  updateisDefaultAddress,
  createAddress,
  deleteAddress,
} = require("../Controllers/userController");
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param } = require("express-validator");
const router = express.Router();
const { addressValidationRules } = require("../validations/addressValidation");
const { userValidationRules } = require("../validations/userValidation");

router.post("/register", userValidationRules, register);

router.post(
  "/login",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("อีเมลห้ามว่างเปล่า")
      .isEmail()
      .withMessage("รูปแบบอีเมลไม่ถูกต้อง")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("รหัสผ่านห้ามว่างเปล่า"),
  ],
  login
);

router.post("/logout", logout); // ไม่ต้องมี authCheck เพราะเราต้องการลบ cookie ไม่ว่า token จะถูกต้องหรือไม่ก็ตาม

router.get("/auth/status", authCheck, checkAuthStatus); // ต้องผ่าน authCheck ก่อน
router.post("/auth/refresh_token", refreshAccessToken);
router.get("/auth/has_token", hasToken);

router.get("/users", authCheck, isAdmin, getAllUsers);

router.get(
  "/users/:id",
  [param("id").isMongoId().withMessage("ID ผู้ใช้ไม่ถูกต้อง")],
  authCheck,
  getUserById
);

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

router.delete("/users/me/address/:addressId", authCheck, deleteAddress);

module.exports = router;
