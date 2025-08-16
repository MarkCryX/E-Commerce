// Controllers/userController.js
const User = require("../Models/User");
const { validationResult } = require("express-validator");


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.getUserById = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.id;

  if (req.user.role !== "admin" && req.user.userId !== userId) {
    return res
      .status(403)
      .json({ message: "Not authorized to access this user's data" });
  }

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError" && err.path === "_id") {
      return res
        .status(400)
        .json({ message: "Invalid user ID format in database" });
    }

    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.createAddress = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // ดักกรณีที่ไม่มีข้อมูลสำหรับอัปเดตเลย
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "กรุณาระบุข้อมูลที่จะอัปเดต" });
  }

  try {
    const userId = req.user.id;
    const address = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.addresses) {
      user.addresses = [];
    }

    if (user.addresses.length === 0) {
      address.isDefault = true;
    }

    if (address.isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push(address);

    await user.save();

    res.status(201).json({
      message: "Address added successfully.",
      addresses: user.addresses,
    });
  } catch (error) {
    console.error(err);
    if (err.name === "ValidationError") {
      // หากเป็น Mongoose validation error ให้ดึงข้อความ error มาจาก err.errors
      const messages = Object.values(err.errors).map((val) => val.message);
      // ส่ง status 400 Bad Request พร้อมข้อความ error ที่ชัดเจน
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.updateAddress = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const newAddress = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return res
        .status(404)
        .json({ message: "ไม่พบบ้านเลขที่ที่ต้องการแก้ไข" });
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      ...newAddress,
    };

    await user.save();

    res.json({ message: "อัปเดตที่อยู่สำเร็จ", addresses: user.addresses });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      // หากเป็น Mongoose validation error ให้ดึงข้อความ error มาจาก err.errors
      const messages = Object.values(err.errors).map((val) => val.message);
      // ส่ง status 400 Bad Request พร้อมข้อความ error ที่ชัดเจน
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: "Server error occurred" });
  }
};

exports.updateisDefaultAddress = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id; // มาจาก token ผ่าน authCheck
    const { addressId } = req.params;
    if (!addressId) {
      return res.status(400).json({ message: "addressId จำเป็นต้องส่งมาด้วย" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    const address = user.addresses.find((a) => a._id.toString() === addressId);
    if (!address) return res.status(404).json({ message: "ไม่พบที่อยู่" });

    user.addresses.forEach((a) => {
      a.isDefault = false;
    });

    address.isDefault = true;

    await user.save();

    res.status(200).json({
      message: "อัปเดตที่อยู่เริ่มต้นเรียบร้อย",
      addresses: user.addresses,
    });
  } catch (err) {
    console.error(err);

    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "ID สินค้าไม่ถูกต้อง" });
    }

    res.status(500).json({ message: "Server error occurred" });
  }
};

exports.deleteAddress = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.id; // มาจาก token ผ่าน authCheck
    const { addressId } = req.params;
    if (!addressId) {
      return res.status(400).json({ message: "addressId จำเป็นต้องส่งมาด้วย" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "ไม่พบผู้ใช้" });

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: "ไม่พบที่อยู่ที่ต้องการลบ" });
    }

    user.addresses.splice(addressIndex, 1);

    await user.save();

    res
      .status(200)
      .json({ message: "ลบที่อยู่เรียบร้อยแล้ว", addresses: user.addresses });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      // หากเป็น Mongoose validation error ให้ดึงข้อความ error มาจาก err.errors
      const messages = Object.values(err.errors).map((val) => val.message);
      // ส่ง status 400 Bad Request พร้อมข้อความ error ที่ชัดเจน
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: "Server error occurred" });
  }
};
