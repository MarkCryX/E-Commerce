import { deleteProduct } from "@/api/product";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ProductCardAdmin = ({ products, onDeleteSuccess }) => {
  if (!products || Object.keys(products).length === 0) {
    return (
      <div className="rounded-lg bg-white p-4 shadow-md">
        <p className="text-gray-600">No product data available</p>
      </div>
    );
  }

  const handleDelete = async (productId) => {
    const confirm = window.confirm(
      `คุณแน่ใจว่าต้องการลบ ${products.name} หรือไม่?`,
    );
    if (!confirm) return;
    try {
      await deleteProduct(productId);
      onDeleteSuccess();
      toast.success("ลบสินค้าสำเร็จ");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error?.response?.data?.message || "ลบสินค้าไม่สำเร็จ");
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-md">
      {products.images && products.images.length > 0 ? (
        <img
          src={products.images[0].url}
          alt={products.name}
          className="mb-4 h-48 w-full rounded-t-lg object-contain"
        />
      ) : (
        <div className="mb-4 flex h-48 w-full items-center justify-center rounded-t-lg bg-gray-200">
          <span className="text-2xl text-gray-500">No Image Available</span>
        </div>
      )}
      <div className="p-2">
        <div className="flex justify-between">
          <h2 className="mb-2 text-xl font-semibold">{products.name}</h2>
          <p className="mb-2 text-xl text-gray-700 ">
            สินค้าเหลือ {products.quantity} ชิ้น
          </p>
        </div>
        {/* <p className="mb-2 text-gray-600">{products.description}</p> */}
        <p className="text-lg font-bold text-green-600">
          {products.price.toLocaleString()} บาท
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between p-2 text-lg text-white">
        <Link
          to={`/admin/edit-product/${products._id}`}
          className="w-1/4 cursor-pointer rounded-2xl bg-yellow-500 p-1 text-center hover:bg-yellow-600"
        >
          แก้ไข
        </Link>
        <button
          className="w-1/4 cursor-pointer rounded-2xl bg-red-500 p-1 hover:bg-red-600"
          onClick={() => handleDelete(products._id)}
        >
          ลบ
        </button>
      </div>
    </div>
  );
};
export default ProductCardAdmin;
