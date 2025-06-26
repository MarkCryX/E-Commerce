import axios from "axios";

export const fetchCategory = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACK_END_URL}/api/category`,
    );
    return response.data.categories || [];
  } catch (error) {
    console.error("Error ไม่สามามารถดึงข้อมูลหมวดหมู่มาได้:", error);
    throw new Error("ไม่สามารถดึงข้อมูลหมวดหมู่ได้");
  }
};

export const fetchCategoryById = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACK_END_URL}/api/category/${id}`,
    );
    return response.data.categories || [];
  } catch (error) {
    console.error("Error ไม่สามามารถดึงข้อมูลหมวดหมู่ตาม ID ได้:", error);
    throw new Error("ไม่สามารถดึงข้อมูลหมวดหมู่ตาม ID ได้");
  }
};

export const createCategory = async (formcategory) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/category`,
      formcategory,
      {
        withCredentials: true,
      },
    );
    return response.data.message || "สร้างหมวดหมู่สำเร็จ";
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors }; // ส่ง array กลับไปให้ frontend แสดงรวมกัน
    }
    const msg = error?.response?.data?.message || "ไม่สามารถสร้างหมวดหมู่ได้";
    throw new Error(msg);
  }
};

export const updateCategory = async (id, formcategory) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACK_END_URL}/api/category/${id}`,
      formcategory,
      { withCredentials: true },
    );

    return response.data.message || "อัพเดทหมวดหมู่สำเร็จ";
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถแก้ไขหมวดหมู่ได้";
    throw new Error(msg);
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACK_END_URL}/api/category/${id}`,
      { withCredentials: true },
    );

    return response.data.message || "ลบหมวดหมู่สำเร็จ";
  } catch (error) {
    const msg = error?.response?.data?.message || "ไม่สามารถลบหมวดหมู่ได้";
    console.error("Error ไม่สามารถลบหมวดหมู่ได้:", error);
    throw new Error(msg);
  }
};
