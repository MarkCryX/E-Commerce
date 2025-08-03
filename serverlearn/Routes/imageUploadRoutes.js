// Routes/imageUploadRoutes.js
const express = require('express');
const { createImages, removeImage } = require('../Controllers/cloudinary'); 
const { authCheck, isAdmin } = require('../Middleware/authcheck');
const { body } = require('express-validator');
const upload = require('../Middleware/upload')

const router = express.Router();

// Endpoint สำหรับการอัปโหลดรูปภาพ
router.post(
    '/upload-images',
    upload.array('images', 10),
    // [
    //     body('images')
    //         .isArray({ min: 1 }).withMessage("ต้องมีรูปภาพอย่างน้อย 1 รูป")
    //         .withMessage('รูปภาพต้องเป็นอาร์เรย์'),
    //     body("images.*")
    //         .isString().withMessage("ข้อมูลรูปภาพต้องเป็น String")
    //         .notEmpty().withMessage("ข้อมูลรูปภาพห้ามว่างเปล่า")
    // ],
    authCheck, 
    isAdmin,   
    createImages 
);

router.post(
    '/remove-image',
    authCheck,      
    isAdmin,       
    removeImage 
);

module.exports = router;