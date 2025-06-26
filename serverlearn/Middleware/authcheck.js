// Middleware/authcheck.js
const jwt = require("jsonwebtoken");

exports.authCheck = (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Access Token verification failed:", err); // เปลี่ยน 'Token' เป็น 'Access Token'
    
    // ถ้า Access Token หมดอายุ ควรส่ง 401 เพื่อให้ Frontend ไปเรียก Refresh Token
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Unauthorized: Access Token expired", expired: true });
    }
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid Access Token" }); // เปลี่ยนเป็น 401 เพื่อให้ Interceptor ทำงาน
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    console.error("Access denied: Admin role required");
    return res.status(403).json({ message: "Forbidden: Admin role required." });
  }
};
