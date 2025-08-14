import ProductForm from "@/components/Product/ProductForm";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const CreateProduct = () => {
  return (
    <div className="ml-3 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <Link
          to="/admin/manage-product"
          className="mb-4 flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300 sm:mb-0" // ปุ่มกลับ
        >
          <FaArrowLeft />
          <span className="font-medium">กลับไปหน้าจัดการสินค้า</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">เพิ่มสินค้า</h1>
      </div>
      <ProductForm mode="create" />
    </div>
  );
};
export default CreateProduct;
