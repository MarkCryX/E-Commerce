// Controllers/orderController.js
const Order = require("../Models/Order");
const User = require("../Models/User");
const Product = require("../Models/Product");
const { validationResult } = require("express-validator");

// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---

exports.createOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user._id; //ดึงมาจาก authcheck
    const { products, shippingAddress, payment } = req.body;

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone) {
      return res.status(400).json({ message: "ข้อมูลที่อยู่ไม่ถูกต้อง" });
    }

    if (!payment) {
      return res.status(400).json({ message: "ข้อมูลการชำระเงินไม่ถูกต้อง" });
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
      shippingAddress,
      payment,
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

exports.readOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    if (!orders)
      return res
        .status(404)
        .json({ message: "ไม่พบคำสั่งซื้อหรือคุณไม่มีสิทธิ์เข้าถึง" });

    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---
exports.getOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({ isCompleted: false })
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.getOrdersCompleted = async (req, res) => {
  try {
    const orders = await Order.find({ isCompleted: true })
      .sort({
        createdAt: -1,
      })
      .select("-paymentSlip");

    return res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิฟเวอร์" });
  }
};

exports.updateStatusOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;

    const updated = await Order.findByIdAndUpdate(
      id,
      { $set: { status: req.body.status } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "ไม่พบคำสั่งซื้อหรือคุณไม่มีสิทธิ์เข้าถึง" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.genQRCodeForOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // หาคำสั่งซื้อจาก id และ userId
    const order = await Order.findOne({ _id: id, userId: userId });
    if (!order) {
      return res
        .status(404)
        .json({ message: "ไม่พบคำสั่งซื้อหรือคุณไม่มีสิทธิ์เข้าถึง" });
    }

    const { totalAmount } = order;
    const recipientId = process.env.RECIPIENT_ID;

    const qrCodeDataUrl = `https://promptpay.io/${recipientId}/${totalAmount}`;

    res.status(200).json({ qrCodeData: qrCodeDataUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.uploadPaymentSlip = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { slipUrl } = req.body;
    const orderId = req.params.id;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentSlip: slipUrl, paymentstatus: "กำลังตรวจสอบการชำระเงิน" },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
    }

    res.json({
      message: "อัปโหลดสลิปสำเร็จ",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปโหลดสลิป" });
  }
};

exports.updatePaymemtStatus = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;

    const updated = await Order.findByIdAndUpdate(
      id,
      { $set: { paymentstatus: req.body.paymentstatus } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "ไม่พบคำสั่งซื้อหรือคุณไม่มีสิทธิ์เข้าถึง" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.completeOrder = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;

    const updated = await Order.findByIdAndUpdate(
      id,
      { $set: { isCompleted: true } },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "ไม่พบคำสั่งซื้อหรือคุณไม่มีสิทธิ์เข้าถึง" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};
