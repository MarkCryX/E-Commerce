import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACK_END_URL}/api/dashboard/stats`;



// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_BASE}/summary`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อที่สำเร็จแล้ว", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg =
      error?.response?.data?.message ||
      "ไม่สามารถดึงข้อมูลคำสั่งซื้อที่สำเร็จได้";
    throw new Error(msg);
  }
};