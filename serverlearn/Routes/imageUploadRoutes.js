// Routes/imageUploadRoutes.js
const express = require('express');
const { createImages, removeImage } = require('../Controllers/cloudinary'); // หรือ Controllers/imageUploadController
const { authCheck, isAdmin } = require('../Middleware/authcheck');
const { body } = require('express-validator'); // ใช้สำหรับ validation input
const upload = require('../Middleware/upload')

const router = express.Router();

// Endpoint สำหรับการอัปโหลดรูปภาพโดยเฉพาะ
router.post(
    '/upload-images',
    upload.array('images', 10),
    // [
    //     body('images')
    //         .isArray({ min: 1 }).withMessage("ต้องมีรูปภาพอย่างน้อย 1 รูป")
    //         .withMessage('รูปภาพต้องเป็นอาร์เรย์'),
    //     body("images.*")
    //         .isString().withMessage("ข้อมูลรูปภาพต้องเป็น String") // ถ้าส่งเป็น Base64 หรือ URL
    //         .notEmpty().withMessage("ข้อมูลรูปภาพห้ามว่างเปล่า")
    // ],
    authCheck, 
    isAdmin,   
    createImages 
);

router.post(
    '/remove-image', // คุณสามารถกำหนดชื่อ endpoint ตามต้องการได้ เช่น /api/delete-image
    authCheck,      
    isAdmin,       
    removeImage // เรียกใช้ controller ที่สร้างไว้
);

module.exports = router;