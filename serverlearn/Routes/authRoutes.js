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
const { authCheck } = require("../Middleware/authcheck");
const {
  loginLimiter,
  registerLimiter,
  apiLimiter,
  logoutLimiter,
  refreshTokenLimiter,
} = require("../Middleware/rateLimiter");
const { body } = require("express-validator");
const router = express.Router();

router.post("/auth/register", registerLimiter, userValidationRules, register);

router.post(
  "/auth/login",
  loginLimiter,
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

router.post("/auth/logout", logoutLimiter, logout);
router.get("/auth/status",apiLimiter, authCheck, checkAuthStatus);
router.post("/auth/refresh_token", refreshTokenLimiter, refreshAccessToken);
router.get("/auth/has_token",apiLimiter, hasToken);

module.exports = router;
