// Controllers/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { validationResult } = require("express-validator");
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createImages = async (req, res,next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
     const files = req.files;

     if (!files || files.length === 0) {
      return res.status(400).json({ message: "ไม่พบไฟล์รูปภาพที่อัปโหลด" });
    }

    const uploadedImages = [];

    for (const file of files) {
      // อัปโหลดไฟล์จาก buffer (ที่ Multer จัดการให้) ขึ้น Cloudinary
      const result = await cloudinary.uploader.upload(file.path, { // ใช้ file.path หรือ file.buffer
        public_id: `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        resource_type: "auto",
        folder: "Product",
      });
      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });

      // (ทางเลือก) ลบไฟล์ชั่วคราวออกจากเซิร์ฟเวอร์หลังจากอัปโหลดขึ้น Cloudinary แล้ว
      fs.unlinkSync(file.path);
    }

    res.status(200).json({ images: uploadedImages, message: "อัปโหลดรูปภาพสำเร็จ" });
  } catch (error) {
     console.error("Backend Cloudinary upload error:", error);
    next(error)
  }
};

exports.removeImage = async (req, res, next) => {
    try {
        // public_id จะถูกส่งมาจาก frontend ใน req.body
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ message: "ไม่พบ public_id ของรูปภาพที่ต้องการลบ" });
        }

        // ใช้ cloudinary.uploader.destroy เพื่อลบรูปภาพ
        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === 'ok') {
            res.status(200).json({ message: "ลบรูปภาพจาก Cloudinary สำเร็จ", public_id });
        } else {
            // กรณี Cloudinary รายงานว่าไม่สำเร็จ (เช่น public_id ไม่ถูกต้อง)
            res.status(404).json({ message: "ไม่สามารถลบรูปภาพได้: " + (result.result || "ไม่พบรูปภาพหรือเกิดข้อผิดพลาดภายใน"), public_id });
        }
    } catch (error) {
        console.error("Backend Cloudinary delete error:", error);
        next(error); // ส่ง error ไปยัง error handling middleware
    }
};