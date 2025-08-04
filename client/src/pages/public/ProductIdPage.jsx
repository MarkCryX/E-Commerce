import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProductById } from "@/api/product";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "@/context/CartContext";
import { FaCartPlus } from "react-icons/fa";
import { extractErrorMessage } from "@/utils/errorHelper";

const ProductIdPage = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { id } = useParams(); // ดึง id จาก URL (เช่น /product/:id)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const navigate = useNavigate();
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (error) {
        const msg = extractErrorMessage(error);
        setError(msg);
        toast.error(msg);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="ml-3 rounded-lg bg-white p-6 text-center shadow-md">
        <p>กำลังโหลดข้อมูลสินค้า...</p>
      </div>
    );
  }

  const handleAddCart = () => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.warn("กรุณาล็อกอิน");
      return;
    }

    if (!selectedColor || !selectedSize) {
      toast.error("กรุณาเลือกสีและไซส์");
      return;
    }

    try {
      const newOrderItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        image: product.images[0].url,
      };

      addToCart(newOrderItem);
      toast.success("เพิ่มสินค้าเข้าตะกร้าแล้ว");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container mx-auto grid min-h-screen grid-cols-1 gap-5 pt-5 sm:grid-cols-1 md:grid-cols-2">
        {product.images && product.images.length > 0 ? (
          <div>
            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              navigation={true}
              pagination={{ clickable: true }}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation, Pagination, Thumbs]}
              className="rounded-lg bg-white shadow"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <div className="relative h-[20rem] w-full rounded-lg sm:h-[25rem] md:h-[30rem] lg:h-[35rem] xl:h-[40rem]">
                    <img
                      src={image.url}
                      alt={`Room image ${index + 1}`}
                      className="h-full w-full rounded-lg object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Thumbnail Swiper */}
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              watchSlidesProgress={true}
              modules={[Thumbs]}
              className="mt-4"
            >
              {product.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image.url}
                    alt={`Thumb ${index + 1}`}
                    className="h-20 w-full cursor-pointer rounded-lg bg-white/50 object-contain shadow"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-4xl font-semibold text-gray-500">ไม่มีรูป</p>
          </div>
        )}

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-500">{product.category?.name}</p>
            <p className="text-2xl">{product.price.toLocaleString()} ฿</p>

            <div className="mt-10">
              <p className="mb-5 text-[18px] font-semibold">เลือกสี</p>
              <div className="grid grid-cols-6 gap-3">
                {product.colors.map((color, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer rounded-md border p-4 text-center transition duration-300 ${
                      selectedColor === color
                        ? "border-black bg-gray-100"
                        : "border-gray-300 bg-white"
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    <p>{color}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="">
            <p className="mb-5 text-[18px] font-semibold">เลือกไซส์</p>
            <div className="grid grid-cols-6 gap-3">
              {product.sizes.map((size, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-md border p-4 text-center transition duration-300 ${
                    selectedSize === size
                      ? "border-black bg-gray-100"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  <p>{size}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="font-semibold">
            <button
              onClick={() => handleAddCart()}
              className="mt-10 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-black p-3 text-white hover:bg-gray-500 sm:mt-10 md:mt-0"
            >
              <FaCartPlus className="text-xl" />
              ใส่ตะกร้า
            </button>
          </div>
        </div>

        <div>
          <h3 className="mt-5 text-xl font-semibold">รายละเอียดสินค้า</h3>
          <p>{product.description}</p>
        </div>
      </div>
    </>
  );
};

export default ProductIdPage;
