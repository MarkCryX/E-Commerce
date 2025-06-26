// middleware/upload.js
const multer = require('multer');
const path = require('path');

// กำหนดที่เก็บไฟล์ชั่วคราว (disk storage)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // โฟลเดอร์ที่เก็บไฟล์ชั่วคราว ควรสร้างโฟลเดอร์นี้ไว้
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// ตรวจสอบประเภทไฟล์
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('รองรับเฉพาะไฟล์รูปภาพเท่านั้น!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // จำกัดขนาดไฟล์ไม่เกิน 5MB
});

module.exports = upload;
