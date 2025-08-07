// Routes/ordersRoutes.js
const express = require("express");
const { createOrder, readOrder } = require("../Controllers/orderController");
const router = express.Router();
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body, param } = require("express-validator");
const { orderValidationRules } = require("../validations/orderValidation");

router.post("/orders", orderValidationRules, authCheck, createOrder);
router.get("/orders/user-orders", authCheck, readOrder);
module.exports = router;
