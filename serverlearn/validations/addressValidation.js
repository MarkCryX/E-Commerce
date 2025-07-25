const { body } = require("express-validator");

exports.addressValidationRules = [
  body("name").notEmpty().trim().escape().withMessage("กรุณากรอกชื่อผู้รับ"),
  body("phone")
    .isString()
    .isLength({ min: 9, max: 10 })
    .isMobilePhone("th-TH")
    .trim()
    .escape()
    .withMessage("กรุณากรอกเบอร์โทรให้ถูกต้อง"),
  body("addressLine").notEmpty().trim().withMessage("กรุณากรอกที่อยู่"),
  body("subDistrict").notEmpty().trim().escape().withMessage("กรุณากรอกตำบล"),
  body("district").notEmpty().trim().escape().withMessage("กรุณากรอกอำเภอ"),
  body("province").notEmpty().trim().escape().withMessage("กรุณากรอกจังหวัด"),
  body("postalCode")
    .notEmpty()
    .trim()
    .escape()
    .withMessage("กรุณากรอกรหัสไปรษณีย์"),
  body("isDefault").optional().isBoolean(),
];
