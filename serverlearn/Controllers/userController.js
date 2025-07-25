// Controllers/userController.js
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Order = require("../Models/Order");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;

if (!cloudinary.config().cloud_name) {
  console.warn(
    "Cloudinary configuration missing! Default profile images may not be generated correctly."
  );
}

exports.register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "This email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const finalProfileImageURL =
      "https://res.cloudinary.com/dim59skus/image/upload/v1753422716/blank-profile-picture-973460_1280_kpbjpk.png";

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImage: finalProfileImageURL,
    });

    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error occurred" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // 15 นาที
    );

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // 7 วัน
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ส่งผ่าน HTTPS เท่านั้นใน production
      sameSite: "Lax", // ป้องกัน CSRF
      maxAge: 15 * 60 * 1000, // อายุ 15 นาที
      path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ส่งผ่าน HTTPS เท่านั้นใน production
      sameSite: "Lax", // ป้องกัน CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // อายุ 7 วัน
      path: "/",
    });

    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      addresses: user.addresses,
      orders: user.orders,
      // เพิ่ม field อื่นๆ ที่คุณต้องการส่งกลับไปด้วย เช่น cart, orders (ถ้าต้องการ)
    };

    res
      .status(200)
      .json({ message: "Login successful", user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error occurred" });
  }
};

exports.refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // 1. ตรวจสอบว่ามี Refresh Token หรือไม่
    if (!refreshToken) {
      return res
        .status(403)
        .json({ isAuthenticated: false, message: "Refresh token not found" });
    }

    // 2. ตรวจสอบลายเซ็นและความถูกต้องของ Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 3. ตรวจสอบในฐานข้อมูลว่า Token ยัง valid อยู่
    const user = await User.findOne({
      _id: decoded.userId,
      refreshToken: refreshToken, // ตรวจสอบว่า Token ตรงกับใน DB
    });

    if (!user) {
      // ลบ Cookie ที่ไม่ถูกต้อง
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        path: "/",
      });

      return res.status(403).json({
        isAuthenticated: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    user.refreshToken = newRefreshToken;

    await user.save();

    // 6. ตั้งค่า Cookie ใหม่
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 7. ส่ง response กลับ
    res.status(200).json({
      isAuthenticated: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Error refreshing token:", err);

    // 8. ลบ Cookie ที่หมดอายุหรือไม่ถูกต้อง
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    });

    const message =
      err.name === "TokenExpiredError"
        ? "Refresh token expired"
        : "Invalid Refresh Token";

    res.status(403).json({
      isAuthenticated: false,
      message,
    });
  }
};

exports.checkAuthStatus = async (req, res) => {
  try {
    return res.status(200).json({
      isAuthenticated: true,
      user: {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        profileImage: req.user.profileImage,
        addresses: req.user.addresses,
        orders: req.user.orders,
      },
    });
  } catch (error) {
    console.error("Error in checkAuthStatus (after middleware):", error);
    res.status(500).json({
      isAuthenticated: false,
      message: "Internal server error",
    });
  }
};

exports.hasToken = (req, res) => {
  const hasAccessToken = Boolean(req.cookies?.accessToken);
  const hasRefreshToken = Boolean(req.cookies?.refreshToken);

  return res.json({
    hasAccessToken,
    hasRefreshToken,
  });
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
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
    const user = await User.findById(userId)
      .populate("orders")
      .select("-password");

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

    res.status(500).json({ message: "Failed to fetch user data" });
  }
};

exports.logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const user = await User.findOne({ refreshToken });

      if (user) {
        // ลบเฉพาะ Token ที่ใช้ล็อกเอาท์
        await User.findByIdAndUpdate(user._id, {
          $unset: { refreshToken: "" },
        });

        await user.save();
      }
    } catch (err) {
      console.error("Error removing refresh token:", err);
    }
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
  });

  // เพิ่ม header เพื่อป้องกัน caching
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  res.status(200).json({
    message: "Logout successful",
    loggedOut: true, // เพิ่ม flag เพื่อให้ Frontend รู้ว่า logout สำเร็จ
  });
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
    res.status(500).json({ message: "Server error occurred" });
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
