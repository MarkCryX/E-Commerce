const { body } = require("express-validator");

exports.categoryValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("ชื่อหมวดหมู่ห้ามว่างเปล่า")
    .isLength({ min: 2, max: 50 })
    .withMessage("ชื่อหมวดหมู่ต้องมีความยาวระหว่าง 2 ถึง 50 ตัวอักษร")
    .trim()
    .escape(), // ป้องกันการโจมตี XSS
];
