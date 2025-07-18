// Routes/productsRoutes.js
const express = require("express");
const {
  readproducts,
  createproduct,
  readproductById,
  updateproduct,
  deleteproduct,
} = require("../Controllers/productController");
const router = express.Router();
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param, validationResult } = require("express-validator");
const { productValidationRules } = require("../validations/productValidation");

router.get("/products", readproducts);

router.get(
  "/products/:id",
  [param("id").isMongoId().withMessage("ID สินค้าไม่ถูกต้อง")],
  // authCheck,
  readproductById
);

router.post(
  "/products",
  productValidationRules,
  authCheck,
  isAdmin,
  createproduct
);

router.put(
  "/products/:id",
  [param("id").isMongoId().withMessage("ID สินค้าไม่ถูกต้อง")],
  productValidationRules,
  authCheck,
  isAdmin,
  updateproduct
);

router.delete(
  "/products/:id",
  [param("id").isMongoId().withMessage("ID สินค้าไม่ถูกต้อง")],
  authCheck,
  isAdmin,
  deleteproduct
);

module.exports = router;
