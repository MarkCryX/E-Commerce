import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductForm from "@/components/Product/ProductForm";
import { fetchProductByIdAdmin } from "@/api/product";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";
import { FaArrowLeft } from "react-icons/fa";

const EditProduct = () => {
  const { id } = useParams(); // ดึง id จาก URL (เช่น /admin/edit-product/:id)
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await fetchProductByIdAdmin(id);
        setProductData(response);
      } catch (error) {
        const message = extractErrorMessage(error);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]); // ให้ useEffect ทำงานเมื่อ id เปลี่ยน

  if (loading) {
    return (
      <div className="ml-3 rounded-lg bg-white p-6 text-center shadow-md">
        <p>กำลังโหลดข้อมูลสินค้า...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-3 rounded-lg bg-white p-6 text-center shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="ml-3 rounded-lg bg-white p-6 text-center shadow-md">
        <p>ไม่พบข้อมูลสินค้า</p>
      </div>
    );
  }

  return (
    <div className="ml-3 min-h-screen rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <Link
          to="/admin/manage-product"
          className="mb-4 flex items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 sm:mb-0" // ปุ่มกลับ
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          <span className="font-medium">กลับไปหน้าจัดการสินค้า</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">แก้ไขสินค้า</h1>
      </div>
      <ProductForm mode="edit" productData={productData} />
    </div>
  );
};
export default EditProduct;
