// Controllers/cloudinary.js
const cloudinary = require("cloudinary").v2;
const { validationResult } = require("express-validator");
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createImages = async (req, res, next) => {
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
      const result = await cloudinary.uploader.upload(file.path, {
        public_id: `product_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)}`,
        resource_type: "auto",
        folder: "Ecom2024/Product",
      });
      
      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });

      //ลบไฟล์รูปที่เก็บสำรองไว้ในไฟล์ /uploads ตามที่ใส่ไว้ในไฟล์ upload.js
      fs.unlinkSync(file.path);
    }

    res
      .status(200)
      .json({ images: uploadedImages, message: "อัปโหลดรูปภาพสำเร็จ" });
  } catch (error) {
    console.error("Backend Cloudinary upload error:", error);
    next(error);
  }
};

exports.removeImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res
        .status(400)
        .json({ message: "ไม่พบ public_id ของรูปภาพที่ต้องการลบ" });
    }

    // ใช้ cloudinary.uploader.destroy เพื่อลบรูปภาพ
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      res.status(200).json({ message: "ลบรูปภาพสำเร็จ", public_id });
    } else {
      res.status(404).json({
        message:
          "ไม่สามารถลบรูปภาพได้: " +
          (result.result || "ไม่พบรูปภาพหรือเกิดข้อผิดพลาดภายใน"),
        public_id,
      });
    }
  } catch (error) {
    console.error("Backend Cloudinary delete error:", error);
    next(error); // ส่ง error ไปยัง error handling middleware
  }
};
