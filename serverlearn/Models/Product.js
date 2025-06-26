// Models/Product.js
const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
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
      default: 1,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category' ,
      required: true,
    },
    images: {
      type: [{
          // <--- เปลี่ยนตรงนี้
          public_id: {
            type: String,
            required: true, // ควรบังคับให้มี public_id
          },
          url: {
            type: String,
            required: true, // ควรบังคับให้มี url
          },
        },],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
