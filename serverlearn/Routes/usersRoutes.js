// Routes/usersRoutes.js
const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateAddress,
  updateisDefaultAddress,
  createAddress,
  deleteAddress,
} = require("../Controllers/userController");
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param } = require("express-validator");
const router = express.Router();
const { addressValidationRules } = require("../validations/addressValidation");


router.get("/users", authCheck, isAdmin, getAllUsers);

router.get(
  "/users/:id",
  [param("id").isMongoId().withMessage("ID ผู้ใช้ไม่ถูกต้อง")],
  authCheck,
  getUserById
);

router.post(
  "/users/me/address",
  addressValidationRules,
  authCheck,
  createAddress
);

router.put(
  "/users/me/address/:addressId",
  [[param("addressId").isMongoId()]],
  addressValidationRules,
  authCheck,
  updateAddress
);

router.put(
  "/users/me/address/default/:addressId",
  [param("addressId").isMongoId().withMessage("addressId ไม่ถูกต้อง")],
  authCheck,
  updateisDefaultAddress
);

router.delete("/users/me/address/:addressId", authCheck, deleteAddress);

module.exports = router;
