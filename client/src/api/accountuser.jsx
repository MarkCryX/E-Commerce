import axios from "axios";

export const createAddress = async (formData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACK_END_URL}/api/users/me/address`,
      formData,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors }; // ส่ง array กลับไปให้ frontend แสดงรวมกัน
    }
    const msg = error?.response?.data?.message || "ไม่สามารถเพิ่มที่อยู่ได้";

    throw new Error(msg);
  }
};

export const updateAdress = async (formData, addressId) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACK_END_URL}/api/users/me/address/${addressId}`,
      formData,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors }; // ส่ง array กลับไปให้ frontend แสดงรวมกัน
    }
    const msg = error?.response?.data?.message || "ไม่สามารถอัพเดทที่อยู่ได้";

    throw new Error(msg);
  }
};

export const updateIsDefaultAddress = async (addressId) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_BACK_END_URL}/api/users/me/address/default/${addressId}`,
      {},
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors }; // ส่ง array กลับไปให้ frontend แสดงรวมกัน
    }

    const msg = error?.response?.data?.message || "ไม่สามารถอัพเดทที่อยู่ได้";

    throw new Error(msg);
  }
};

export const deleteAddress = async (addressId) => {
  try {
    const response = await axios.delete(
      `${import.meta.env.VITE_BACK_END_URL}/api/users/me/address/${addressId}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    const errors = error?.response?.data?.errors;
    if (Array.isArray(errors)) {
      throw { errors }; // ส่ง array กลับไปให้ frontend แสดงรวมกัน
    }
    const msg = error?.response?.data?.message || "ไม่สามารถลบที่อยู่ได้";

    throw new Error(msg);
  }
};
