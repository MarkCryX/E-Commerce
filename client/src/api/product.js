import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACK_END_URL}/api/products`;
const API_BASE_ADMIN = `${import.meta.env.VITE_BACK_END_URL}/api/admin/products`;

// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---

export const fetchProducts = async (page = 1, limit = 20, sortBy = "createdAt_desc",category = null) => {
  try {
     // สร้าง URLSearchParams เพื่อจัดการ query string
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    params.append('sortBy', sortBy);

    // เพิ่ม category ใน query string เฉพาะเมื่อมีค่า
    if (category) {
      params.append('category', category);
    }
    const response = await axios.get(
      `${API_BASE}?${params.toString()}`,
    );
    return response.data || [];
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถดึงข้อมูลสินค้าได้";
    throw new Error(msg);
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้าตาม ID", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถดึงข้อมูลสินค้าตาม ID ได้";
    throw new Error(msg);
  }
};

// --- Public: Highlight Products
export const fetchNewArrivals = async () => {
  try {
    const response = await axios.get(`${API_BASE}/highlight/new-arrivals`);
    return response.data || []
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้ามาใหม่", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors }; 
    }
    const msg = error?.response?.data?.message || "ไม่สามารถดึงข้อมูลสินค้ามาใหม่ได้";
    throw new Error(msg);
  }
}


// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---

export const fetchProductsAdmin = async () => {
  try {
    const response = await axios.get(API_BASE_ADMIN, {
      withCredentials: true,
    });
    return response.data || [];
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถดึงข้อมูลสินค้าได้";
    throw new Error(msg);
  }
};

export const fetchProductByIdAdmin = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_ADMIN}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลตาม ID", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถดึงข้อมูลสินค้าตาม ID ได้";
    throw new Error(msg);
  }
};

export const createProduct = async (formproduct) => {
  try {
    const response = await axios.post(API_BASE_ADMIN, formproduct, {
      withCredentials: true,
    });

    return response.data.message || "เพิ่มสินค้าสำเร็จ";
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสร้างสินค้า", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถสร้างสินค้าได้";
    throw new Error(msg);
  }
};

export const updateProductById = async (id, productData) => {
  try {
    const response = await axios.put(`${API_BASE_ADMIN}/${id}`, productData, {
      withCredentials: true,
    });

    return response.data.message || "อัพเดทสินค้าสำเร็จ";
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัพเดทสินค้า", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถอัพเดทสินค้าได้";
    throw new Error(msg);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_ADMIN}/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบสินค้าตาม ID", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถลบสินค้าตาม ID ได้";
    throw new Error(msg);
  }
};
