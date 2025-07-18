import { useEffect, useState } from "react";

const AddressCard = ({ mode, setModal, onSubmit, addressData }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressLine: "",
    subDistrict: "",
    district: "",
    province: "",
    postalCode: "",
    isDefault: false,
  });

  // ถ้า mode เป็น edit ให้ preload ข้อมูลเข้า form
  useEffect(() => {
    if (mode === "edit" && addressData) {
      setFormData(addressData);
    }
  }, [mode, addressData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // ส่งข้อมูลกลับไปยัง parent
    // setModal(false); // ปิด modal
  };

  return (
    <div className="bg-opacity-40 fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="relative w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-center text-xl font-semibold">
          {mode === "create" ? "เพิ่มที่อยู่" : "แก้ไขที่อยู่"}
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="ชื่อ - นามสกุล"
            className="col-span-2 rounded border p-2"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="เบอร์โทรศัพท์"
            maxLength={10}
            className="col-span-2 rounded border p-2"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                // อนุญาตเฉพาะตัวเลข
                handleChange(e);
              }
            }}
            required
          />
          <input
            type="text"
            name="addressLine"
            placeholder="บ้านเลขที่ / หมู่บ้าน / อาคาร"
            className="col-span-2 rounded border p-2"
            value={formData.addressLine}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="subDistrict"
            placeholder="แขวง / ตำบล"
            className="rounded border p-2"
            value={formData.subDistrict}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="district"
            placeholder="เขต / อำเภอ"
            className="rounded border p-2"
            value={formData.district}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="province"
            placeholder="จังหวัด"
            className="rounded border p-2"
            value={formData.province}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="รหัสไปรษณีย์"
            maxLength={5}
            className="rounded border p-2"
            value={formData.postalCode}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
                // อนุญาตเฉพาะตัวเลข
                handleChange(e);
              }
            }}
            required
          />
          <label className="col-span-2 mt-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
            />
            ตั้งเป็นที่อยู่เริ่มต้น
          </label>

          <div className="col-span-2 mt-4 flex justify-end gap-2">
            <button
              type="button"
              className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
              onClick={() => setModal(false)}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {mode === "create" ? "เพิ่มที่อยู่" : "บันทึกการแก้ไข"}
            </button>
          </div>
        </form>

        <button
          className="absolute top-2 right-4 cursor-pointer text-2xl font-bold hover:text-red-500"
          onClick={() => setModal(false)}
        >
          ×
        </button>
      </div>
    </div>
  );
};
export default AddressCard;
