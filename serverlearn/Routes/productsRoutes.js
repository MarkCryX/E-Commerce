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

router.get("/products", readproducts);

router.get(
  "/products/:id",
  [param("id").isMongoId().withMessage("ID สินค้าไม่ถูกต้อง")],
  authCheck,
  readproductById
);

router.post(
  "/products",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("ชื่อสินค้าห้ามว่างเปล่า")
      .isLength({ min: 3, max: 100 })
      .withMessage("ชื่อสินค้าต้องมี 3-100 ตัวอักษร"),
    body("price")
      .notEmpty()
      .withMessage("ราคาสินค้าห้ามว่างเปล่า")
      .isFloat({ gt: 0 })
      .withMessage("ราคาสินค้าต้องเป็นตัวเลขและมากกว่า 0"),
    body("quantity")
      .notEmpty()
      .withMessage("จำนวนสินค้าห้ามว่างเปล่า")
      .isInt({ min: 0 })
      .withMessage("จำนวนสินค้าต้องเป็นจำนวนเต็มบวกหรือ 0"),
    body("category")
      .trim()
      .notEmpty()
      .withMessage("หมวดหมู่สินค้าห้ามว่างเปล่า")
      .isLength({ min: 3, max: 30 })
      .withMessage("หมวดหมู่สินค้าต้องมี 3-30 ตัวอักษร"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("รายละเอียดสินค้าห้ามว่างเปล่า"),
    body("images")
      .isArray({ min: 1 })
      .withMessage("ต้องมีรูปภาพอย่างน้อย 1 รูป") // images array ต้องไม่ว่างเปล่าสำหรับ create
      .custom((images) => {
        if (!Array.isArray(images)) {
          throw new Error("รูปภาพต้องเป็นอาร์เรย์"); // ควรถูกดักด้วย isArray ก่อนหน้านี้แล้ว
        }
        if (images.length > 10) {
          throw new Error("จำนวนรูปภาพต้องไม่เกิน 10 รูป"); // <--- ข้อความ Error ที่ต้องการ
        }
        return true; // ถ้าผ่านเงื่อนไข ให้ return true
      }),
    body("images.*.url") // ตรวจสอบ property 'url' ภายในแต่ละ object
      .notEmpty()
      .withMessage("URL รูปภาพห้ามว่างเปล่า")
      .isURL()
      .withMessage("ลิ้งค์รูปภาพไม่ถูกต้อง"), // <--- แก้ไขตรงนี้
    body("images.*.public_id") // ตรวจสอบ property 'public_id' ภายในแต่ละ object
      .notEmpty()
      .withMessage("Public ID รูปภาพห้ามว่างเปล่า")
      .isString()
      .withMessage("Public ID รูปภาพต้องเป็นข้อความ"), // <--- แก้ไขตรงนี้
    // --- สิ้นสุดการแก้ไข Images Validation ---
  ],
  authCheck,
  isAdmin,
  createproduct
);

router.put(
  "/products/:id",
  [
    param("id").isMongoId().withMessage("ID สินค้าไม่ถูกต้อง"),
    body("name")
      .trim()
      .notEmpty()
      .withMessage("ชื่อสินค้าห้ามว่างเปล่า")
      .isLength({ min: 3, max: 100 })
      .withMessage("ชื่อสินค้าต้องมี 3-100 ตัวอักษร"),
    body("price")
      .notEmpty()
      .withMessage("ราคาสินค้าห้ามว่างเปล่า")
      .isFloat({ gt: 0 })
      .withMessage("ราคาสินค้าต้องเป็นตัวเลขและมากกว่า 0"),
    body("quantity")
      .notEmpty()
      .withMessage("จำนวนสินค้าห้ามว่างเปล่า")
      .isInt({ min: 0 })
      .withMessage("จำนวนสินค้าต้องเป็นจำนวนเต็มบวกหรือ 0"),
    body("category")
      .trim()
      .notEmpty()
      .withMessage("หมวดหมู่สินค้าห้ามว่างเปล่า")
      .isLength({ min: 3, max: 30 })
      .withMessage("หมวดหมู่สินค้าต้องมี 3-30 ตัวอักษร"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("รายละเอียดสินค้าห้ามว่างเปล่า"),
    body("images")
      .isArray({ min: 1 })
      .withMessage("ต้องมีรูปภาพอย่างน้อย 1 รูป") // images array ต้องไม่ว่างเปล่าสำหรับ create
      .custom((images) => {
        if (!Array.isArray(images)) { 
          throw new Error("รูปภาพต้องเป็นอาร์เรย์"); // ควรถูกดักด้วย isArray ก่อนหน้านี้แล้ว
        }
        if (images.length > 10) {
          throw new Error("จำนวนรูปภาพต้องไม่เกิน 10 รูป"); // <--- ข้อความ Error ที่ต้องการ
        }
        return true; // ถ้าผ่านเงื่อนไข ให้ return true
      }),
    body("images.*.url") // ตรวจสอบ property 'url' ภายในแต่ละ object
      .notEmpty()
      .withMessage("URL รูปภาพห้ามว่างเปล่า")
      .isURL()
      .withMessage("ลิ้งค์รูปภาพไม่ถูกต้อง"), // <--- แก้ไขตรงนี้
    body("images.*.public_id") // ตรวจสอบ property 'public_id' ภายในแต่ละ object
      .notEmpty()
      .withMessage("Public ID รูปภาพห้ามว่างเปล่า")
      .isString()
      .withMessage("Public ID รูปภาพต้องเป็นข้อความ"), // <--- แก้ไขตรงนี้
    // --- สิ้นสุดการแก้ไข Images Validation ---
  ],
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
