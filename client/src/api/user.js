import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACK_END_URL}/api/users/me/address`;
const API_BASE_ADMIN = `${import.meta.env.VITE_BACK_END_URL}/api/admin/users`;


// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---

export const createAddress = async (formData) => {
  try {
    const response = await axios.post(API_BASE, formData, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดไม่สามารถเพิ่มที่อยู่ได้", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถเพิ่มที่อยู่ได้";
    throw new Error(msg);
  }
};

export const updateAdress = async (formData, addressId) => {
  try {
    const response = await axios.put(`${API_BASE}/${addressId}`, formData, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดไม่สามารถอัพเดทที่อยู่ได้", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถอัพเดทที่อยู่ได้";
    throw new Error(msg);
  }
};

export const updateIsDefaultAddress = async (addressId) => {
  try {
    const response = await axios.put(
      `${API_BASE}/default/${addressId}`,
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดไม่สามารถอัพเดทที่อยู่เป็นค่าเริ่มต้นได้", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถอัพเดทที่อยู่เป็นค่าเริ่มต้นได้";
    throw new Error(msg);
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await axios.delete(`${API_BASE}/${addressId}`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดไม่สามารถลบที่อยู่ได้", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "ไม่สามารถลบที่อยู่ได้";

    throw new Error(msg);
  }
};

// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---