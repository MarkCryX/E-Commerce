// Routes/productsRoutes.js
const express = require("express");
const {
  readproducts,
  createproduct,
  readproductById,
  updateproduct,
  deleteproduct,
  readAllProductsAdmin,
  readProductByIdAdmin,
} = require("../Controllers/productController");
const router = express.Router();
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { param } = require("express-validator");
const { productValidationRules } = require("../validations/productValidation");

// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---

router.get("/products", readproducts);
router.get(
  "/products/:id",
  [param("id").isMongoId().withMessage("ID สินค้าไม่ถูกต้อง")],
  readproductById
);

// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---

router.get("/admin/products", authCheck, isAdmin, readAllProductsAdmin);

router.get(
  "/admin/products/:id",
  [param("id").isMongoId().withMessage("ID สินค้าไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  readProductByIdAdmin
);

router.post(
  "/admin/products",
  productValidationRules,
  authCheck,
  isAdmin,
  createproduct
);

router.put(
  "/admin/products/:id",
  [param("id").isMongoId().withMessage("ID สินค้าไม่ถูกต้อง")],
  productValidationRules,
  authCheck,
  isAdmin,
  updateproduct
);

router.delete(
  "/admin/products/:id",
  [param("id").isMongoId().withMessage("ID สินค้าไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  deleteproduct
);

module.exports = router;
