import { deleteCategory } from "@/api/category";
import { toast } from "react-toastify";
import CategoryForm from "./CategoryForm";
import { useState } from "react";

const CategoryCard = ({ categories, onDeleteSuccess }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleDelete = async (categoryId) => {
    const confirm = window.confirm(
      `คุณแน่ใจว่าต้องการลบ ${categories.name} หรือไม่?`,
    );
    if (!confirm) return;

    try {
      const response = await deleteCategory(categoryId);
      onDeleteSuccess();
      toast.success(response);
    } catch (error) {
      toast.error(error?.response?.data?.message || "ไม่สามารถลบหมวดหมู่ได้");
    }
  };

  return (
    <div className="flex h-16 items-center justify-between rounded-lg border border-gray-200 bg-white p-2 shadow-md">
      <h2 className="text-lg">{categories.name}</h2>

      <div className="flex items-center justify-between gap-4 p-2 text-lg text-white">
        <button
          className="cursor-pointer rounded-lg bg-yellow-500 p-1 px-2 hover:bg-yellow-600"
          onClick={() => setModalOpen(true)}
        >
          แก้ไข
        </button>
        <button
          className="cursor-pointer rounded-lg bg-red-500 p-1 px-2 hover:bg-red-600"
          onClick={() => handleDelete(categories._id)}
        >
          ลบ
        </button>
      </div>
      {modalOpen && (
        <CategoryForm
          closemodal={() => setModalOpen(false)}
          mode="edit"
          onSuccess={onDeleteSuccess}
          categorydata={categories}
        />
      )}
    </div>
  );
};
export default CategoryCard;
