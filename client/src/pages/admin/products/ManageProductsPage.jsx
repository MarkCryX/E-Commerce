// src/pages/admin/ManageProductsPage.jsx
import { useState, useEffect } from "react";
import { fetchProducts } from "../../../api/product";
import ProductCard from "../../../components/Product/ProductCard";
import { Link } from "react-router-dom";

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const loadProducts = async () => {
    try {
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="ml-3 rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">จัดการสินค้า</h1>
        <div>
          <Link
            to="/admin/create-product"
            className="cursor-pointer rounded-2xl bg-green-500 p-2 text-lg text-white transition-colors hover:bg-green-600"
          >
            เพิ่มสินค้า
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array(5)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-lg bg-gray-300"
              />
            ))}
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p className="col-span-full text-center text-gray-500">
          ไม่มีสินค้า
        </p>
      ) : (
        <div className="grid max-h-screen grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              products={product}
              onDeleteSuccess={loadProducts}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageProductsPage;
