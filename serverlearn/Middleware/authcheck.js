// Middleware/authcheck.js
const jwt = require("jsonwebtoken");
const User = require("../Models/User");

exports.authCheck = async (req, res, next) => {
  try {
    // 1. ดึง Token จาก Cookies
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // 2. ตรวจสอบว่ามี Access Token หรือไม่
    if (!accessToken) {
      // 2.1. ถ้าไม่มี Access Token แต่มี Refresh Token
      if (refreshToken) {
        return res.status(401).json({
          isAuthenticated: false,
          shouldRefresh: true,
          message: "Access token missing, please refresh",
        });
      }
      // 2.2. ถ้าไม่มีทั้ง Access Token และ Refresh Token
      return res.status(401).json({
        isAuthenticated: false,
        message: "No authentication token found",
      });
    }

    // 3. ตรวจสอบ Access Token
    try {
      // 3.1. ถอดรหัส (Verify) Access Token
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET); // ใช้ JWT_SECRET ในการถอดรหัส
      // `decoded` จะมีข้อมูลที่ถูกเก็บไว้ใน token เช่น userId

      // 3.2. ค้นหาข้อมูลผู้ใช้จากฐานข้อมูล
      const user = await User.findById(decoded.userId)
        .select("-password -refreshToken")
        .populate("orders"); // ดึงข้อมูลผู้ใช้ ยกเว้น password และ refreshToken

      // 3.3. ตรวจสอบว่าพบผู้ใช้หรือไม่
      if (!user) {
        return res.status(401).json({
          isAuthenticated: false,
          message: "ไม่พบผู้ใช้งาน",
        });
      }

      // 3.4. เพิ่มข้อมูลผู้ใช้ใน Object `req`
      req.user = user;
      next();
    } catch (tokenError) {
      // 4. จัดการข้อผิดพลาดในการตรวจสอบ Access Token
      // 4.1. ถ้า Access Token หมดอายุหรือไม่ถูกต้อง และมี Refresh Token
      if (refreshToken) {
        // แนะนำให้ทำการ Refresh Token
        return res.status(401).json({
          isAuthenticated: false,
          shouldRefresh: true,
          message: "Access token expired, please refresh",
        });
      }

      // 4.2. ถ้า Access Token หมดอายุหรือไม่ถูกต้อง และไม่มี Refresh Token
      return res.status(401).json({
        isAuthenticated: false,
        message: "Invalid access token",
      });
    }
  } catch (error) {
    res.status(500).json({
      isAuthenticated: false,
      message: "Authentication check failed",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  // 1. ตรวจสอบว่ามีข้อมูลผู้ใช้ใน req (จาก authCheck) และบทบาทเป็น "admin"
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    // 2. ถ้าไม่ใช่ admin
    return res.status(403).json({
      message: " ต้องมีสิทธิ์เข้าถึงในฐานะผู้ดูแลระบบ",
      shouldRefresh: false,
    });
  }
};
