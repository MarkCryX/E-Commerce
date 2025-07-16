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

const getRandomBackgroundColor = () => {
  const colors = [
    "4287f5", // Blue
    "f54242", // Red
    "42f567", // Green
    "f5e742", // Yellow
    "9b42f5", // Purple
    "f542d1", // Pink
    "42f5c2", // Teal
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

exports.register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้ไปแล้ว" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // --- Logic สำหรับสร้าง URL รูปโปรไฟล์อัตโนมัติ ---
    const firstLetter = username.charAt(0).toUpperCase(); // เอาตัวอักษรแรกของ username
    const bgColor = getRandomBackgroundColor(); // สุ่มสีพื้นหลัง
    const textColor = "ffffff"; // สีข้อความเป็นสีขาว (ตามต้องการ)

    // หากใช้การสร้าง Text-to-Image โดยตรงของ Cloudinary (ง่ายกว่า)
    // คุณต้องกำหนด public_id ที่ไม่ซ้ำกัน
    const generatedImagePublicId = `user_profile/${username}_${Date.now()}`;
    const uploadResult = await cloudinary.uploader.text(firstLetter, {
      // ปรับปรุงรูปภาพตรงนี้
      public_id: generatedImagePublicId,
      folder: "UserProfiles", // โฟลเดอร์สำหรับรูปโปรไฟล์ผู้ใช้
      font_family: "Arial",
      font_size: 120,
      font_weight: "bold",
      background: `#${bgColor}`,
      color: `#${textColor}`,
      width: 200,
      height: 200,
      gravity: "center",
      crop: "fill",
    });

    const finalProfileImageURL = uploadResult.secure_url;

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImage: finalProfileImageURL,
    });

    await newUser.save();

    res.status(201).json({ message: "ลงทะเบียนสำเร็จ" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
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
      // เพิ่ม field อื่นๆ ที่คุณต้องการส่งกลับไปด้วย เช่น cart, orders (ถ้าต้องการ)
    };

    res
      .status(200)
      .json({ message: "เข้าสู่ระบบสำเร็จ", user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

exports.refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  

  // 1. ตรวจสอบว่ามี Refresh Token หรือไม่
  if (!refreshToken) {
    return res
      .status(403)
      .json({ isAuthenticated: false, message: "ไม่มี Refresh Token" });
  }

  try {
    // 2. ตรวจสอบลายเซ็นและความถูกต้องของ Token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("✅ Decoded refresh token:", decoded);
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
        message: "Refresh Token ไม่ถูกต้อง",
      });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 6. ตั้งค่า Cookie ใหม่
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: 15 * 60 * 1000,
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
        ? "Refresh Token หมดอายุ"
        : "Invalid Refresh Token";

    res.status(403).json({
      isAuthenticated: false,
      message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
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
      .json({ message: "ไม่ได้รับอนุญาตให้เข้าถึงข้อมูลผู้ใช้นี้" });
  }

  try {
    const user = await User.findById(userId)
      .populate("orders")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    if (err.name === "CastError" && err.path === "_id") {
      return res
        .status(400)
        .json({ message: "ID คำสั่งซื้อไม่ถูกต้องในฐานข้อมูล" });
    }

    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
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
      },
    });
  } catch (error) {
    console.error("Error in checkAuthStatus (after middleware):", error);
    res.status(500).json({ 
      isAuthenticated: false, 
      message: "Internal server error" 
    });
  }
};

exports.hasToken = (req , res) => {
  const hasAccessToken = Boolean(req.cookies?.accessToken);
  const hasRefreshToken = Boolean(req.cookies?.refreshToken);

  return res.json({
    hasAccessToken,
    hasRefreshToken
  })
}

exports.logout = (req, res) => {
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
    message: "ออกจากระบบสำเร็จ",
    loggedOut: true, // เพิ่ม flag เพื่อให้ Frontend รู้ว่า logout สำเร็จ
  });
};
