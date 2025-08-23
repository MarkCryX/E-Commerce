// api/clouinary.jsx
import axios from "axios";

const API_BASE_ADMIN = `${import.meta.env.VITE_BACK_END_URL}/api/admin`;


// --- Admin Endpoints (สำหรับผู้ดูแลระบบ) ---
export const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("images", file);

  try {
    const response = await axios.post(
      `${API_BASE_ADMIN}/upload-images`,
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
    console.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg =
      error?.response?.data?.message || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ";
    throw new Error(msg);
  }
};

export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_ADMIN}/remove-image`, // URL ของ Backend API สำหรับลบรูปภาพ
      { data: { public_id: publicId }, withCredentials: true }, // ส่ง public_id ไปใน body ของ request
    );
    return response.data; // Backend จะคืนค่า { message, public_id }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบรูปภาพ", error);
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors };
    }
    const msg = error?.response?.data?.message || "เกิดข้อผิดพลาดในการลบรูปภาพ";
    throw new Error(msg);
  }
};
