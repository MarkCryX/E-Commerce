import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACK_END_URL}/api/category`;
const API_BASE_ADMIN = `${import.meta.env.VITE_BACK_END_URL}/api/admin/category`


// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---
export const fetchCategory = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data.categories || [];
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg =
      error?.response?.data?.message || "ไม่สามารถดึงข้อมูลหมวดหมู่ได้";

    throw new Error(msg);
  }
};

export const fetchCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`);
    return response.data.categories || [];
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหมวดหมู่ตาม ID", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg =
      error?.response?.data?.message || "ไม่สามารถดึงข้อมูลหมวดหมู่ตาม ID ได้";

    throw new Error(msg);
  }
};

// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---
export const createCategory = async (formcategory) => {
  try {
    const response = await axios.post(API_BASE_ADMIN, formcategory, {
      withCredentials: true,
    });
    return response.data.message || "สร้างหมวดหมู่สำเร็จ";
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างหมวดหมู่", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถสร้างหมวดหมู่ได้";
    throw new Error(msg);
  }
};

export const updateCategory = async (id, formcategory) => {
  try {
    const response = await axios.put(`${API_BASE_ADMIN}/${id}`, formcategory, {
      withCredentials: true,
    });

    return response.data.message || "อัพเดทหมวดหมู่สำเร็จ";
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูลหมวดหมู่", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถอัพเดทหมวดหมู่ได้";
    throw new Error(msg);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_ADMIN}/${id}`, {
      withCredentials: true,
    });

    return response.data.message || "ลบหมวดหมู่สำเร็จ";
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบหมวดหมู่", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถลบหมวดหมู่ได้";

    throw new Error(msg);
  }
};
