import { Link } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const ProductCard = ({ product }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1 }); // ให้ทำแค่รอบเดียวตอนเห็น

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="h-full"
    >
      <Link to={`/product/${product._id}`}>
        <div className="h-full w-full cursor-pointer rounded-lg bg-white shadow-md transition duration-300 hover:scale-105">
          {product.images?.[0]?.url ? (
            <img
              src={product.images[0].url}
              alt=""
              className="mb-2 h-64 w-full rounded-t-lg object-cover"
            />
          ) : (
            <div className="mb-2 flex h-40 items-center justify-center rounded-t-lg bg-gray-200">
              <h2 className="text-gray-500">ไม่มีรูป</h2>
            </div>
          )}

          <div className="px-3 pb-3">
            <h2 className="truncate text-base font-semibold text-gray-800">
              {product.name}
            </h2>
            <p className="text-sm font-semibold text-gray-600">
              ฿{product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
