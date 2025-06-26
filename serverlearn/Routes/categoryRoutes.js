// Routes/categoryRoutes.js
const express = require("express");
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body,param } = require("express-validator"); // ใช้สำหรับ validation input
const {
  createCategory,
  readCategory,
  readCategoryById,
  updateCategory,
  deleteCategory,
} = require("../Controllers/categoryController");
const router = express.Router();

router.get("/category", readCategory);

router.get(
  "/category/:id",
  [param("id").isMongoId().withMessage("ID หมวดหมู่ไม่ถูกต้อง")],
  readCategoryById
);

router.post(
  "/category",
  [
    body("name")
      .notEmpty()
      .withMessage("ชื่อหมวดหมู่ห้ามว่างเปล่า")
      .isLength({ min: 2, max: 50 })
      .withMessage("ชื่อหมวดหมู่ต้องมีความยาวระหว่าง 2 ถึง 50 ตัวอักษร")
      .trim()
      .escape(), // ป้องกันการโจมตี XSS
  ],
  authCheck,
  isAdmin,
  createCategory
);

router.put(
  "/category/:id",
  [
    body("name")
      .notEmpty()
      .withMessage("ชื่อหมวดหมู่ห้ามว่างเปล่า")
      .isLength({ min: 2, max: 50 })
      .withMessage("ชื่อหมวดหมู่ต้องมีความยาวระหว่าง 2 ถึง 50 ตัวอักษร")
      .trim()
      .escape(), // ป้องกันการโจมตี XSS
  ],
  authCheck,
  isAdmin,
  updateCategory
);

router.delete("/category/:id", authCheck, isAdmin, deleteCategory);

module.exports = router;
