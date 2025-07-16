import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"; // Import useParams
import ProductForm from "@/components/Product/ProductForm";
import { fetchProductById } from "@/api/product"; // สมมติว่ามี API สำหรับดึงสินค้าด้วย ID
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";

const EditProduct = () => {
  const { id } = useParams(); // ดึง id จาก URL (เช่น /admin/edit-product/:id)
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id); // เรียก API เพื่อดึงข้อมูลสินค้าด้วย ID
        setProductData(data);
      } catch (err) {
        const msg = extractErrorMessage(err);
        console.error("Error fetching product for edit:", err);
        setError(msg);
        toast.error(msg);
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
    <div className="ml-3 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <Link
          to="/admin/manage-product"
          className="mb-4 flex items-center rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 sm:mb-0" // ปุ่มกลับ
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-medium">กลับไปหน้าจัดการสินค้า</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">แก้ไขสินค้า</h1>
      </div>
      <ProductForm mode="edit" productData={productData} />
    </div>
  );
};
export default EditProduct;
