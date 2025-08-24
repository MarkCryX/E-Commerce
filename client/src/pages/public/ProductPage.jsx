import { useEffect, useState, useRef, useCallback } from "react";
import { fetchProducts } from "@/api/product";
import { fetchCategory } from "@/api/category";
import ProductCard from "@/components/Product/ProductCard";
import { FaFilter } from "react-icons/fa";
import ModalFilter from "@/components/Product/ModalFilter";
import SidebarFilter from "@/components/Product/SidebarFilter";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalFilter, setModalFilter] = useState(false);
  const observer = useRef();
  const [show, setShow] = useState(true);

  const handleCategoryChange = (categoryId) => {
    // ถ้าคลิกหมวดหมู่เดิม ให้ยกเลิกการเลือก
    const newCategory = selectedCategory === categoryId ? null : categoryId;
    setSelectedCategory(newCategory);
    setProducts([]);
    setPage(1);
    setHasMore(true);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
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

  // ดึงหมวดหมู่
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchCategory(); // เรียกใช้ API ดึงหมวดหมู่ทั้งหมด
        setCategories(response || []);
      } catch (error) {
        const message = extractErrorMessage(error);
        console.error("ไม่สามารถดึงข้อมูลหมวดหมู่ได้", error);
        setError(message);
        toast.error(message);
      }
    };
    loadCategories();
  }, []);

  //ดึง product เริ่มต้นและ ดึงตาม filter ที่เลือกไว้
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await fetchProducts(page,20,sortBy,selectedCategory);

        const fetchedProducts = response?.products || [];
         
        if (fetchedProducts.length === 0 || response?.page >= response?.totalPages) {
        setHasMore(false);
        }

        setProducts((prev) => {
        // กรองสินค้าที่ซ้ำกันและไม่เป็น null ก่อนเพิ่ม
        const newProducts = fetchedProducts.filter(
          (p) => p && !prev.some((old) => old._id === p._id)
        );
        return [...prev, ...newProducts];
        });

      } catch (error) {
        const message = extractErrorMessage(error);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, sortBy, selectedCategory]); // ทำงานเมื่อ page sortBy selectedCategory มีการเปลี่ยนแปลง

  useEffect(() => {
    if (modalFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function: เพื่อให้แน่ใจว่า scroll จะกลับมาทำงานเมื่อ component ถูก unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalFilter]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-end px-5 py-5">
        <button
          className="flex cursor-pointer items-center gap-1 rounded-md border p-2 lg:hidden"
          onClick={() => setModalFilter(true)}
        >
          ตัวกรอง
          <FaFilter />
        </button>
        <select
          name="sort-by"
          onChange={(e) => handleSortChange(e.target.value)}
          value={sortBy}
          className="hidden cursor-pointer rounded-md border p-2 lg:block"
        >
          <option value="createdAt_desc">เรียงตาม: ใหม่ล่าสุด</option>
          <option value="price_desc">ราคา: สูง-ต่ำ</option>
          <option value="price_asc">ราคา: ต่ำ-สูง</option>
        </select>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_5fr]">
        <SidebarFilter
          categories={categories || []}
          show={show}
          setShow={setShow}
          handleCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
        />

        <div className="grid grid-cols-2 gap-5 px-5 pb-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

      {modalFilter && (
        <ModalFilter
          categories={categories}
          selectedCategory={selectedCategory}
          handleCategoryChange={handleCategoryChange}
          setModalFilter={setModalFilter}
          sortBy={sortBy}
          handleSortChange={handleSortChange}
        />
      )}

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
