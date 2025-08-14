import { useState, useEffect } from "react";
import { createCategory, updateCategory } from "@/api/category";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";

const CategoryForm = ({ closemodal, mode, onSuccess, categorydata }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        const response = await createCategory({ name: name.trim() });
        setName("");
        onSuccess();
        closemodal();
        toast.success(response || "สร้างหมวดหมู่สำเร็จ");
        
      } else if (mode === "edit" && categorydata) {
        const response = await updateCategory(categorydata._id, {
          name: name.trim(),
        });
        setName("");
        onSuccess();
        closemodal();
        toast.success(response || "อัพเดทหมวดหมู่สำเร็จ");
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === "edit" && categorydata) {
      setName(categorydata.name || "");
    }
  }, [mode, categorydata]);

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <h1 className="text-center text-lg font-semibold">
          {mode === "create" ? "เพิ่มหมวดหมู่" : "แก้ไขหมวดหมู่"}
        </h1>
        <form className="mt-4" onSubmit={handleSubmit}>
          <label className="text-gray-800">
            {mode === "create" ? "ชื่อหมวดหมู่" : "ชื่อหมวดหมู่ที่จะแก้ไข"}
          </label>
          <input
            type="text"
            required
            className="mb-4 w-full rounded-lg border border-gray-200 p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="กรุณากรอกชื่อหมวดหมู่"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="mt-4 flex justify-between">
            <button
              className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "กำลังบันทึก..."
                : mode === "create"
                  ? "บันทึกหมวดหมู่"
                  : "บันทึกการแก้ไขหมวดหมู่"}
            </button>
            <button
              className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
              onClick={closemodal}
              type="button"
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CategoryForm;
