import { useEffect, useState, useRef, useCallback } from "react";
import { fetchProducts } from "@/api/product";
import ProductCard from "@/components/Product/ProductCard";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("createdAt_desc");
  const observer = useRef();

  const handleSortChange = (value) => {
    setSortOrder(value);
    setProducts([]); // ล้างสินค้าเดิม
    setPage(1); // รีเซ็ตหน้า
    setHasMore(true); // รีเซ็ต hasMore
  };

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
        const res = await fetchProducts(page, 20, sortOrder);
        if (res.products.length === 0 || res.page >= res.totalPages) {
          setHasMore(false);
        }
        setProducts((prev) => {
          // กรองสินค้าที่ซ้ำกันก่อนเพิ่ม (ป้องกันกรณี IntersectionObserver ทำงานซ้ำ)
          const newProducts = res.products.filter(
            (p) => !prev.some((old) => old._id === p._id),
          );
          return [...prev, ...newProducts];
        });
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, sortOrder]);

  return (
    <div className="container mx-auto">
      <div className="px-5 py-5 text-end">
        <select
          name="sort-by"
          onChange={(e) => handleSortChange(e.target.value)}
          value={sortOrder}
          className="rounded-md border p-2"
        >
          <option value="createdAt_desc">เรียงตาม: ใหม่ล่าสุด</option>
          <option value="price_desc">ราคา: สูง-ต่ำ</option>
          <option value="price_asc">ราคา: ต่ำ-สูง</option>
        </select>
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
      {!hasMore && !loading && products.length > 0 && (
        <p className="py-4 text-center text-gray-500">
          คุณดูสินค้าจนครบทุกรายการแล้ว
        </p>
      )}
      {!loading && products.length === 0 && (
        <p className="py-4 text-center text-gray-500">
          ไม่พบสินค้าในหมวดหมู่นี้
        </p>
      )}
    </div>
  );
};
export default ProductPage;
