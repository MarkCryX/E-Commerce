// Routes/categoryRoutes.js
const express = require("express");
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param } = require("express-validator"); // ใช้สำหรับ validation input
const {
  createCategory,
  readCategory,
  readCategoryById,
  updateCategory,
  deleteCategory,
} = require("../Controllers/categoryController");
const {
  categoryValidationRules,
} = require("../validations/categoryValidation");

const router = express.Router();


// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---

router.get("/category", readCategory);

router.get(
  "/category/:id",
  [param("id").isMongoId().withMessage("ID หมวดหมู่ไม่ถูกต้อง")],
  readCategoryById
);

// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---

router.post(
  "/admin/category",
  categoryValidationRules,
  authCheck,
  isAdmin,
  createCategory
);

router.put(
  "/admin/category/:id",
  [param("id").isMongoId().withMessage("ID หมวดหมู่ไม่ถูกต้อง")],
  categoryValidationRules,
  authCheck,
  isAdmin,
  updateCategory
);

router.delete(
  "/admin/category/:id",
  [param("id").isMongoId().withMessage("ID หมวดหมู่ไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  deleteCategory
);

module.exports = router;
