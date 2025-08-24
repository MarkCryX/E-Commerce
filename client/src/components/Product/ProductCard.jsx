import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  
  if (!product) {
    return (
      <div className="h-full">
        <div className="h-full w-full rounded-sm bg-gray-100 p-4">
          <p className="text-gray-500">สินค้าไม่พร้อมแสดง</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <Link to={`/product/${product._id}`}>
        <div className="h-full w-full cursor-pointer rounded-sm bg-white shadow-sm transition duration-300 hover:scale-105">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt="รูปสินค้า"
              className="mb-2 h-64 w-full rounded-t-lg object-cover"
            />
          ) : (
            <div className="mb-2 flex h-40 items-center justify-center rounded-t-lg bg-gray-200">
              <h2 className="text-gray-500">ไม่มีรูป</h2>
            </div>
          )}

          <div className="flex flex-col gap-1 px-3 pb-3">
            <h2 className="truncate text-base font-semibold text-gray-800">
              {product.name || "ไม่มีชื่อสินค้า"}
            </h2>
            <p className="text-sm text-gray-500">
              {product.category?.name || "ไม่มีหมวดหมู่"}
            </p>
            <p className="text-sm text-gray-500">
              {product.colors?.length || 0} สี
            </p>
            <p className="text-sm font-semibold text-gray-600">
              ฿{product.price?.toLocaleString() || "N/A"}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
