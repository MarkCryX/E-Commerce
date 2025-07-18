const { body } = require("express-validator");

exports.orderValidationRules = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("ต้องมีสินค้าอย่างน้อย 1 ชิ้นในคำสั่งซื้อ"),
  body("products.*.product") // ตรวจสอบ product ID ภายใน array
    .notEmpty()
    .withMessage("Product ID ห้ามว่างเปล่า")
    .isMongoId()
    .withMessage("Product ID ไม่ถูกต้อง"),
  body("products.*.quantity") // ตรวจสอบ quantity ภายใน array
    .notEmpty()
    .withMessage("Quantity ห้ามว่างเปล่า")
    .isInt({ min: 1 })
    .withMessage("Quantity ต้องเป็นจำนวนเต็มบวก"),
];
