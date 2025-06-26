const { validationResult } = require("express-validator");
const Category = require("../Models/Category");

exports.createCategory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name } = req.body;

  try {
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({ message: "หมวดหมู่นี้มีอยู่แล้ว" });
    }

    const newCategory = new Category({ name });
    await newCategory.save();

    return res
      .status(201)
      .json({ mesaage: "สร้างหมวดหมู่สำเร็จ", category: newCategory });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการสร้างหมวดหมู่" });
  }
};

exports.readCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).json({ categories });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงหมวดหมู่" });
  }
};

exports.readCategoryById = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ message: "ไม่พบหมวดหมู่ที่ต้องการดึงข้อมูล" });
    }

    return res.status(200).json({ category });
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงหมวดหมู่ตาม ID", error);
    return res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการดึงหมวดหมู่ตาม ID" });
  }
};

exports.updateCategory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "ไม่พบหมวดหมู่ที่ต้อองการอัพเดท" });
    }

    const existingCategory = await Category.findOne({ name });

    if (existingCategory && existingCategory._id.toString() !== id) {
      return res.status(400).json({ message: "หมวดหมู่นี้มีอยู่แล้ว" });
    }

    category.name = name;
    await category.save();

    return res.status(200).json({ message: "อัพเดทหมวดหมู่สำเร็จ", category });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ mesaage: "เกิดข้อผิดพลาดในการอัพเดทหมวดหมู่" });
  }
};

exports.deleteCategory = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "ไม่พบหมวดหมู่ที่ต้องการลบ" });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({ message: "ลบหมวดหมู่สำเร็จ" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ mesaage: "เกิดข้อผิดพลาดในการลบหมวดหมู่" });
  }
};
