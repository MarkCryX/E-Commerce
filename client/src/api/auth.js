import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACK_END_URL}/api/auth`;

export const Register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE}/register`, userData);

    return response.data;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการสมัครสมาชิก", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }

    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      "เกิดข้อผิดพลาดในการสมัครสมาชิก";
    throw new Error(msg);
  }
};

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

    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      "เกิดข้อผิดพลาดในการล็อกอิน";
    throw new Error(msg);
  }
};

export const Logout = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/auth/logout`,
      {},
      { withCredentials: true },
    );

    return response;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการล็อกเอาท์", error);
    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      "เกิดข้อผิดพลาดในการล็อกเอาท์";
    throw new Error(msg);
  }
};

export const HasToken = async () => {
  try {
    const response = await axios.get(`${API_BASE}/has_token`, {
      withCredentials: true,
    });

    return response;
  } catch (error) {
    console.error("ตรวจสอบการมีอยู่ของโทเคนไม่สำเร็จ", error);
    const msg =
      error?.response?.data?.message ||
      error?.response?.data ||
      "ตรวจสอบการมีอยู่ของโทเคนไม่สำเร็จ";
    throw new Error(msg);
  }
};

export const CheckAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE}/status`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("เช็คสถานะการล็อกอินล้มเหลว", error);
    throw error;
  }
};

export const RefreshToken = async () => {
  try {
    const response = await axios.post(
      `${API_BASE}/refresh_token`,
      {},
      { withCredentials: true },
    );
    return response;
  } catch (error) {
    console.error("Refresh token ล้มเลว", error);
    throw error;
  }
};
