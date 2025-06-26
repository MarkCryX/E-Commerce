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
        name:{
          type: String,
          required: true
        },
        price:{
          type: Number,
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1
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
      enum: ["รอชำระ","ชำระเสร็จสิ้น"],
      default: "รอชำระ"
    },
    isOrder: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
