import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACK_END_URL}/api/products`;

export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_BASE);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors }; // ส่ง array กลับไปให้ frontend แสดงรวมกัน
    }
    const msg = error?.response?.data?.message || "ไม่สามารถสร้างหมวดหมู่ได้";
    throw new Error(msg);
  }
};

export const createProduct = async (formproduct) => {
  try {
    const response = await axios.post(API_BASE, formproduct, {
      withCredentials: true,
    });

    return response.data.message || "เพิ่มสินค้าสำเร็จ";
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors }; // ส่ง array กลับไปให้ frontend แสดงรวมกัน
    }
    const msg = error?.response?.data?.message || "ไม่สามารถสร้างสินค้า";
    throw new Error(msg);
  }
};

export const updateProductById = async (id, productData) => {
  try {
    const response = await axios.put(`${API_BASE}/${id}`, productData, {
      withCredentials: true,
    });

    return response.data.message || "อัพเดทสินค้าสำเร็จ";
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors }; // ส่ง array กลับไปให้ frontend แสดงรวมกัน
    }
    const msg = error?.response?.data?.message || "ไม่สามารถอัพเดทสินค้าได้";
    throw new Error(msg);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
