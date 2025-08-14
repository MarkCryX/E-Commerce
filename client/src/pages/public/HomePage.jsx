import { useEffect, useState } from "react";
import { fetchNewArrivals } from "@/api/product";
import HeroSection from "@/components/Home/HeroSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import ProductHighlightCard from "@/components/Product/ProductHighlightCard";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null)
  
  const fetchproduct = async () => {
    try {
      const response = await fetchNewArrivals();
      setProducts(response);
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    fetchproduct();
  }, []);

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* <section className="grid grid-cols-2 py-5 text-center sm:grid-cols-3">
        <div>
          <h3 className="mb-2 text-xl font-semibold">ส่งฟรีทั่วไทย</h3>
          <p>เมื่อสั่งซื้อครบ 1,000 บาท</p>
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold">รับประกันคุณภาพ</h3>
          <p>รองเท้าทุกคู่ผ่านการ QC</p>
        </div>
        <div>
          <h3 className="mb-2 text-xl font-semibold">เปลี่ยนคืนได้</h3>
          <p>ภายใน 7 วันหากมีปัญหา</p>
        </div>
      </section> */}

      <div className="">
        <div className="container mx-auto">
          <h1 className="mb-5 text-3xl font-semibold">สินค้ามาใหม่</h1>
          <div className="">
            <Swiper
              modules={[Navigation, Scrollbar, A11y]}
              spaceBetween={20}
              slidesPerView={2}
              scrollbar={false}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 5 },
              }}
            >
              {products.map((product) => (
                <SwiperSlide key={product._id} className="p-3">
                  <ProductHighlightCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
