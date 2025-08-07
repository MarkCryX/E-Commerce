import { Link } from "react-router-dom";

const ProductHighlightCard = ({ product }) => {
  return (
    <div>
      <Link to={`/product/${product._id}`}>
        <div className="relative cursor-pointer rounded-sm transition duration-300 hover:scale-105">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt="image product"
              className="mb-2 h-44 w-44 rounded-full object-cover sm:h-60 sm:w-60 md:h-64 md:w-64"
            />
          ) : (
            <div className="mb-2 flex h-40 items-center justify-center rounded-t-lg bg-gray-200">
              <h2 className="text-gray-500">ไม่มีรูป</h2>
            </div>
          )}

          <div className="absolute top-4 left-2 flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-gray-900">
              {product.name}
            </h2>
            <p className="text-sm text-gray-500">{product.colors.length} สี</p>
          </div>

          <p className="absolute right-1 bottom-1 text-2xl font-semibold text-gray-600 sm:right-9 sm:bottom-1 md:right-3 md:bottom-1 lg:right-13 lg:bottom-1 xl:right-5 xl:bottom-1">
            ฿{product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
};
export default ProductHighlightCard;
