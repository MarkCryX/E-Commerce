// api/clouinary.jsx
import axios from "axios";

const API_BASE = import.meta.env.VITE_BACK_END_URL;

export const uploadImageToCloudinary = async (file, onProgress) => {
  // สร้าง FormData object เพื่อส่งไฟล์
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
        onUploadProgress: (progressEvent) => {
          // เพิ่ม onUploadProgress
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          // ตรวจสอบว่า onProgress ถูกส่งมาและเป็นฟังก์ชันก่อนเรียกใช้
          if (onProgress && typeof onProgress === "function") {
            // <--- ตรวจสอบให้ละเอียดขึ้น
            onProgress(percentCompleted);
          }
        },
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
