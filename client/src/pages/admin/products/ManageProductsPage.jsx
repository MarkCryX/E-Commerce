// src/pages/admin/ManageProductsPage.jsx
import { useState, useEffect } from "react";
import { fetchProductsAdmin, deleteProduct } from "../../../api/product";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    try {
      const response = await fetchProductsAdmin();
      setProducts(response);
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (productId, productName) => {
    const confirmDelete = window.confirm(
      `คุณแน่ใจว่าต้องการลบ "${productName}" หรือไม่?`,
    );
    if (!confirmDelete) return;

    try {
      const response = await deleteProduct(productId);
      toast.success(response.message);
      loadProducts();
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    }
  };

  
  if (!products) {
    return (
      <div className="h-full">
        <div className="h-full w-full rounded-sm bg-gray-100 p-4">
          <p className="text-gray-500">สินค้าไม่พร้อมแสดง</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-3 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">จัดการสินค้า</h1>
        <Link
          to="/admin/create-product"
          className="cursor-pointer rounded-2xl bg-green-500 p-2 text-lg text-white transition-colors hover:bg-green-600"
        >
          เพิ่มสินค้า
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 text-center">กำลังโหลดสินค้า...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">ไม่มีสินค้า</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border text-left text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ลำดับ</th>
                <th className="border px-4 py-2">รหัสสินค้า</th>
                <th className="border px-4 py-2">ชื่อสินค้า</th>
                <th className="border px-4 py-2">คงเหลือ</th>
                <th className="border px-4 py-2">ราคา</th>
                <th className="border px-4 py-2">หมวดหมู่</th>
                <th className="border px-4 py-2">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product._id || index} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{product._id}</td>
                  <td className="border px-4 py-2">{product.name || "ไม่มีชื่อสินค้า"}</td>
                  <td className="border px-4 py-2">{product.quantity ?? 0} ชิ้น</td>
                  <td className="border px-4 py-2">
                    {product.price?.toLocaleString() || "N/A"} บาท
                  </td>
                  <td className="border px-4 py-2">{product.category?.name || "ไม่มีหมวดหมู่"}</td>
                  <td className="flex justify-center gap-10 border px-4 py-2">
                    <Link
                      to={`/admin/edit-product/${product._id || ""}`}
                      className="rounded bg-yellow-400 px-3 py-1 text-white hover:bg-yellow-500"
                    >
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id || "", product.name || "")}
                      className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;
