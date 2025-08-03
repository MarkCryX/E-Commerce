import { useEffect, useState, useRef, useCallback } from "react";
import { fetchProducts } from "@/api/product";
import ProductCard from "@/components/Product/ProductCard";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const observer = useRef();

  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const res = await fetchProducts(page, 20);
        if (res.products.length === 0 || res.page === res.totalPages) {
          setHasMore(false);
        }
        setProducts((prev) => {
          const newProducts = res.products.filter(
            (p) => !prev.some((old) => old._id === p._id),
          );
          return [...prev, ...newProducts];
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page]);

  return (
    <div className="mx-10 pb-10">
      <div className="px-5 py-5 text-end">
        <p>ตัวซ่อนfilter กับ เรียงตาม</p>
      </div>
      <div className="grid grid-cols-[1fr_5fr]">
        <div className="py-5 pl-5">
          <h2>Filter Product</h2>
        </div>
        <div className="grid grid-cols-4 gap-5 px-5 py-5">
          {products.map((product, index) => {
            if (products.length === index + 1) {
              return (
                <div ref={lastProductRef} key={product._id}>
                  <ProductCard product={product} />
                </div>
              );
            } else {
              return <ProductCard key={product._id} product={product} />;
            }
          })}
        </div>
      </div>
      {loading && <p className="py-4 text-center">กำลังโหลด...</p>}
    </div>
  );
};
export default ProductPage;
