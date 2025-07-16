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
  hasToken
} = require("../Controllers/userController");
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param } = require("express-validator");
const router = express.Router();

router.post(
  "/register",
  [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("username ห้ามว่างเปล่า")
      .isLength({ min: 3, max: 30 })
      .withMessage("ชื่อผู้ใช้ต้องมี 3-30 ตัวอักษร"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email ห้ามว่างเปล่า")
      .isEmail()
      .withMessage("รูปแบบอีเมลไม่ถูกต้อง")
      .normalizeEmail()
      .escape(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร")
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "รหัสผ่านต้องมีอย่างน้อย 8 ตัว, มีตัวพิมพ์เล็ก, ตัวพิมพ์ใหญ่, ตัวเลข, และสัญลักษณ์"
      ),
  ],
  register
);

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
router.get("/auth/status",authCheck,checkAuthStatus); // ต้องผ่าน authCheck ก่อน
router.post("/auth/refresh_token", refreshAccessToken);
router.get("/auth/has_token", hasToken);
router.get("/users", authCheck, isAdmin, getAllUsers);
router.get(
  "/users/:id",
  [param("id").isMongoId().withMessage("ID ผู้ใช้ไม่ถูกต้อง")],
  authCheck,
  getUserById
);

module.exports = router;
