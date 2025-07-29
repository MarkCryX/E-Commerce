// Controllers/orderController.js
const Order = require("../Models/Order");
const User = require("../Models/User");
const Product = require("../Models/Product");
const { validationResult } = require("express-validator");

exports.createOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user._id; //ดึงมาจาก authcheck
    const { products, shippingAddress } = req.body;

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone) {
      return res.status(400).json({ message: "ข้อมูลที่อยู่ไม่ถูกต้อง" });
    }

    let calculatedTotalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: `ไม่พบสินค้า` });
      }

      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `สินค้า ${product.name} มีสต็อกไม่เพียงพอ` });
      }

      calculatedTotalAmount += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        image: product.images[0].url,
        name: product.name,
        size: item.size,
        color: item.color,
      });

      product.quantity -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      userId: userId,
      products: orderProducts,
      totalAmount: calculatedTotalAmount,
      shippingAddress, // ✅ บันทึกข้อมูลที่อยู่ใน Order
    });

    const savedOrder = await newOrder.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );

    res.status(201).json({ message: "สร้างคำสั่งซื้อสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};
