import { useEffect, useState } from "react";
import { fetchCategory } from "@/api/category";
import CategoryCard from "@/components/Category/CategoryCard";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CategoryForm from "@/components/Category/CategoryForm";
import { extractErrorMessage } from "@/utils/errorHelper";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadCategories = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await fetchCategory();
      setCategories(response);
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="max-h-screen overflow-y-auto rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-center text-2xl font-semibold">
          จัดการหมวดหมู่สินค้า
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="cursor-pointer rounded-2xl bg-green-500 p-2 text-lg text-white transition-colors hover:bg-green-600"
        >
          เพิ่มหมวดหมู่
        </button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          Array(4)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-gray-300"
              />
            ))
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : categories.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            ไม่มีหมวดหมู่สินค้า
          </p>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category._id}
              categories={category}
              onDeleteSuccess={loadCategories}
            />
          ))
        )}
      </div>
      {modalOpen && (
        <CategoryForm
          closemodal={() => setModalOpen(false)}
          mode="create"
          onSuccess={loadCategories}
        />
      )}
    </div>
  );
};
export default ManageCategory;
