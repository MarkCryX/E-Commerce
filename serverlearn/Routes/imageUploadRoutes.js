// Routes/imageUploadRoutes.js
const express = require("express");
const { createImages, removeImage } = require("../Controllers/cloudinary");
const { authCheck, isAdmin } = require("../Middleware/authcheck");
const { body } = require("express-validator");
const upload = require("../Middleware/upload");

const router = express.Router();

// Endpoint สำหรับการอัปโหลดรูปภาพ
router.post(
  "/upload-images",
  upload.array("images", 10),
  authCheck,
  isAdmin,
  createImages
);

router.delete("/remove-image", authCheck, isAdmin, removeImage);

module.exports = router;
