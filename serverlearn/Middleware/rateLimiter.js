//src/middleware/rateLimiter.js
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 10, // จำกัด 10 request ต่อ IP
  message: "คุณพยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่อีกครั้งภายหลัง",
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 ชั่วโมง
  max: 10, // จำกัด 10 request ต่อ IP
  message: "คุณพยายามสมัครสมาชิกมากเกินไป กรุณาลองใหม่ภายหลัง",
});

const logoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 10, // จำกัด 10 request ต่อ IP
  message: "คุณพยายามล็อกเอาท์มากเกินไป กรุณาลองใหม่ภายหลัง",
});

const refreshTokenLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 นาที
  max: 10, // จำกัด 10 request ต่อ IP
  message: "คุณพยายามรีเฟรชโทเค็นมากเกินไป กรุณาลองใหม่ภายหลัง",
});

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 นาที
  max: 100, // จำกัด 100 request ต่อ IP
  message: "คุณพยายามเรียก request มากเกินไป กรุณาลองใหม่ภายหลัง",
});

module.exports = {
  loginLimiter,
  registerLimiter,
  logoutLimiter,
  apiLimiter,
  refreshTokenLimiter,
};
