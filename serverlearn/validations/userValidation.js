const { body } = require("express-validator");

exports.userValidationRules = [
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
];


