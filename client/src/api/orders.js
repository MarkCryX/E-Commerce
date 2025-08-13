import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BACK_END_URL}/api/orders`;

// --- Public Endpoints (สำหรับผู้ใช้ทั่วไป) ---
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

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE}/user-orders`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message || "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้";
    throw msg;
  }
};

// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---
export const fetchOrdersAdmin = async () => {
  try {
    const response = await axios.get(API_BASE, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message || "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้";
    throw msg;
  }
};

export const updateStatusOrder = async (id, status) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/${id}/status`,
      { status },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message || "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้";
    throw msg;
  }
};

export const genQRCodeForOrder = async (id) => {
  try {
    const response = await axios.get(`${API_BASE}/qrcode/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message || "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้";
    throw msg;
  }
};

export const uploadPaymentSlip = async (id, slipUrl) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/${id}/payment-slip`,
      { slipUrl },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    const msg = error?.response?.data?.message || "ไม่สามารถอัปโหลดสลิปได้";
    throw msg;
  }
};

export const updatePaymemtStatus = async (id, status) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/${id}/payment-status`,
      { paymentstatus },
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message || "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้";
    throw msg;
  }
};

export const closeOrder = async (id) => {
  try {
    const response = await axios.patch(
      `${API_BASE}/${id}/complete`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    const msg =
      error?.response?.data?.message || "ไม่สามารถดึงข้อมูลคำสั่งซื้อได้";
    throw msg;
  }
};
