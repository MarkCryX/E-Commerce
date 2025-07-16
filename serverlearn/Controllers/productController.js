// Controllers/productController.js
const Product = require("../Models/Product");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;

// ดึงข้อมูล products ทั้งหมด
exports.readproducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate("category", "name");
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

// ดึงข้อมูล product ตาม id ที่ส่งมา
exports.readproductById = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const id = req.params.id;

    const product = await Product.findById(id).populate("category", "name");

    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

// เพิ่มข้อมูล product
exports.createproduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, price, quantity, description, category, images,sizes,colors } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      quantity,
      description,
      sizes,
      colors,
      category,
      images: images || [],
    });

    const savedProduct = await newProduct.save();

    const populatedProduct = await Product.findById(savedProduct._id).populate(
      "category",
      "name"
    );

    res
      .status(201)
      .json({ message: "เพิ่มข้อมูลสินค้าสำเร็จ" }, populatedProduct);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      // หากเป็น Mongoose validation error ให้ดึงข้อความ error มาจาก err.errors
      const messages = Object.values(err.errors).map((val) => val.message);
      // ส่ง status 400 Bad Request พร้อมข้อความ error ที่ชัดเจน
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

//อัพเดท product ตามที่ id และ req.body ส่งเข้ามา
exports.updateproduct = async (req, res) => {
  // 1. ตรวจสอบ validation errors จาก express-validator ก่อน
  const errors = validationResult(req);

  // 2. ตรวจสอบว่า body ว่างเปล่าหรือไม่ (หลังจาก validation ผ่าน)
  // หาก validation ผ่าน แต่ req.body ไม่มี field ที่ตรวจสอบ หรือมีแต่ค่าว่าง
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // ดักกรณีที่ไม่มีข้อมูลสำหรับอัปเดตเลย
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "กรุณาระบุข้อมูลที่จะอัปเดต" });
  }

  try {
    const { id } = req.params;
    const updated = await Product.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    }).populate("category", "name");
    if (!updated) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      // Mongoose validation errors มักจะมี properties ที่ชัดเจน
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ message: messages });
    }
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
};

//ลบ product ตามที่ id ส่งมา
exports.deleteproduct = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;

    // ** 2. เพิ่ม Logic ลบรูปภาพจาก Cloudinary ตรงนี้ **
    // 2.1 ค้นหาสินค้าที่จะลบ เพื่อดึงข้อมูลรูปภาพ (public_id)
    const productToDelete = await Product.findById(id);

    if (!productToDelete) {
      return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการลบ" });
    }

    // 2.2 ดึง public_id ของรูปภาพทั้งหมดที่เกี่ยวข้องกับสินค้านี้
    const imagePublicIds = productToDelete.images.map((img) => img.public_id);

    // 2.3 ลบรูปภาพออกจาก Cloudinary
    if (imagePublicIds.length > 0) {
      const deletePromises = imagePublicIds.map((publicId) =>
        cloudinary.uploader.destroy(publicId)
      );
      const results = await Promise.all(deletePromises); // รอให้ทุกการลบรูปภาพเสร็จสิ้น
    }

    // ** 3. ลบสินค้าออกจากฐานข้อมูล (ส่วนนี้มีอยู่แล้ว) **
    const deleted = await Product.findOneAndDelete({ _id: id }).exec();

    if (!deleted) {
      // กรณีที่สินค้าอาจถูกลบไปแล้วระหว่างที่กำลังลบรูปภาพ (โอกาสน้อย)
      return res
        .status(404)
        .json({ message: "ไม่พบสินค้าหลังจากพยายามลบรูปภาพ" });
    }

    res
      .status(200)
      .json({ message: "ลบ product และรูปภาพที่เกี่ยวข้องสำเร็จ" }); // <-- เปลี่ยนข้อความตอบกลับให้สื่อว่าลบรูปภาพด้วย
  } catch (err) {
    console.error("Error deleting product and images:", err); // เปลี่ยนข้อความ Error ให้สื่อชัดเจนขึ้น
    // การจัดการ Error สำหรับ ObjectID ไม่ถูกต้อง หรือ Error อื่นๆ
    if (err.kind === "ObjectId") {
      return res.status(400).json({ message: "ID สินค้าไม่ถูกต้อง" });
    }
    res.status(500).json({
      message: "เกิดข้อผิดพลาดในการลบสินค้าและรูปภาพ",
      error: err.message,
    }); // เพิ่ม err.message เพื่อ Debug ได้ง่ายขึ้น
  }
};
