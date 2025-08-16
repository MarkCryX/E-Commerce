const express = require("express");
const {
  register,
  login,
  checkAuthStatus,
  logout,
  refreshAccessToken,
  hasToken,
} = require("../Controllers/authController");
const { userValidationRules } = require("../validations/userValidation");
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param } = require("express-validator");
const router = express.Router();

router.post("/auth/register", userValidationRules, register);

router.post(
  "/auth/login",
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

router.post("/auth/logout", logout); // ไม่ต้องมี authCheck เพราะเราต้องการลบ cookie ไม่ว่า token จะถูกต้องหรือไม่ก็ตาม
router.get("/auth/status", authCheck, checkAuthStatus); 
router.post("/auth/refresh_token", refreshAccessToken);
router.get("/auth/has_token", hasToken);

module.exports = router;