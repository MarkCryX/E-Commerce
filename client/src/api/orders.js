import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACK_END_URL}/api/orders`;

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(API_BASE, orderData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || "ไม่สามารถสร้างคำสั่งซื้อได้";
    throw msg;
  }
};
