// api/clouinary.jsx
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACK_END_URL;

export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("images", file);

  try {
    const response = await axios.post(
      `${API_BASE}/api/upload-images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      },
    );
    return response.data.images[0];
  } catch (error) {
    console.error(
      "Error uploading image via backend:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ",
    );
  }
};

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const response = await axios.post(
      `${API_BASE}/api/remove-image`, // URL ของ Backend API สำหรับลบรูปภาพ
      { public_id: publicId }, // ส่ง public_id ไปใน body ของ request
      {
        withCredentials: true,
      },
    );
    return response.data; // Backend จะคืนค่า { message, public_id }
  } catch (error) {
    console.error(
      "Error deleting image via backend:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "เกิดข้อผิดพลาดในการลบรูปภาพ",
    );
  }
};
