// Models/Order.js
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        image:{
          type: String,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["รอดำเนินการ", "เสร็จสิ้น", "ยกเลิก"],
      default: "รอดำเนินการ",
    },
    paymentstatus: {
      type: String,
      enum: ["รอชำระ", "ชำระเสร็จสิ้น"],
      default: "รอชำระ",
    },
    isOrder: {
      type: Boolean,
      default: false,
    },
    shippingAddress: {
      name: String,
      phone: String,
      addressLine: String,
      subDistrict: String,
      district: String,
      province: String,
      postalCode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
