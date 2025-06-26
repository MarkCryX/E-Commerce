// Controllers/orderController.js
const Order = require('../Models/Order');
const User = require('../Models/User');
const Product = require('../Models/Product')
const {validationResult} = require('express-validator')

exports.createOrder = async (req, res) => {
    const errors = validationResult(req); // <-- เพิ่มบรรทัดนี้

    if (!errors.isEmpty()) { // <-- เพิ่มบรรทัดนี้
        return res.status(400).json({ errors: errors.array() }); // <-- เพิ่มบรรทัดนี้
    }

    const userId = req.user.userId;
    const { products } = req.body;

    try {

        let calculatedTotalAmount = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.product); // ค้นหาสินค้าจาก ID จริงๆ

            if (!product) {
                return res.status(404).json({ message: `ไม่พบสินค้าที่มี ID: ${item.product}` });
            }
            if (product.quantity < item.quantity) { // ตรวจสอบสต็อก
                return res.status(400).json({ message: `สินค้า ${product.name} มีสต็อกไม่เพียงพอ` });
            }

            calculatedTotalAmount += product.price * item.quantity; // ใช้ราคาจริงจาก DB
            orderProducts.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
                name: product.name
                //เก็บ product.name และ product.price ไว้ใน orderProducts เพื่อ snapshot ราคาตอนสั่งซื้อ
            });
            
            product.quantity -= item.quantity;
            await product.save();
        }


        const newOrder = new Order({
            userId: userId,
            products: orderProducts,
            totalAmount: calculatedTotalAmount,
        });

        const savedOrder = await newOrder.save();

        await User.findByIdAndUpdate(
            userId,
            { $push: { orders: savedOrder._id } },
            { new: true }
        );

        res.status(201).json({ message: "สร้างคำสั่งซื้อสำเร็จ"});
    }catch (err) {
        console.error(err);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
    }
}