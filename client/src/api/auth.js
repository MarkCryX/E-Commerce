import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACK_END_URL}/api/auth`;

export const Login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_BASE}/login`,
      { email, password },
      { withCredentials: true },
    );

    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการล็อกอิน", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }

    const msg = error?.response?.data?.message || error?.response?.data || "เกิดข้อผิดพลาดในการล็อกอิน";
    throw new Error(msg);
  }
};
