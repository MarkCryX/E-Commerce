import { useCart } from "@/context/CartContext";
import { MdDeleteOutline } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { createOrder } from "@/api/orders";
import { toast } from "react-toastify";
import AddressModal from "@/components/UserAccount/Adress/AddressModal";

const CartPage = () => {
  const { user } = useAuth();
  const {
    cart,
    removeFromCart,
    addToCart,
    clearCart,
    handleIncrease,
    handleDecrease,
  } = useCart();
  const [addressModal, setAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const address = user.addresses;
  const currentAddress =
    selectedAddress || address.find((address) => address.isDefault);
  const total = cart.reduce(
    (total, item) => item.quantity * item.price + total,
    0,
  );

  const itemcart = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSubmit = async () => {
    try {
      if (!currentAddress) {
        toast.warn("กรุณาเลือกที่อยู่ก่อนทำการสั่งซื้อ");
        return;
      }

      const orderData = {
        products: cart.map((item) => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        totalAmount: total,
        shippingAddress: currentAddress,
      };

      const response = await createOrder(orderData);
      clearCart();
      toast.success("สั่งซื้อสินค้าสำเร็จ");
    } catch (error) {
      toast.error(error);
    }
  };

  useEffect(() => {
    if (addressModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [addressModal]);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2">
        <div className="h-[300px] w-full overflow-y-scroll rounded-lg bg-white p-4 shadow-md sm:h-[750px]">
          <p className="text-3xl font-semibold">
            ตะกร้าสินค้า{" "}
            <span className="text-gray-700">{`(${itemcart})`}</span>
          </p>
          {cart.map((product) => (
            <div
              className="mt-5 grid grid-cols-[1.3fr_3fr_1fr_1fr] border-b-[1px] pb-5"
              key={`${product._id}-${product.size}-${product.color}`}
            >
              <div className="flex justify-center">
                <img src={product.image} alt="" className="h-16" />
              </div>
              <div>
                <p className="text-xl">{product.name}</p>
                <div className="flex gap-3 text-sm">
                  <p>ไซส์:{product.size}</p>
                  <p>สี:{product.color}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-3">
                  <button
                    className="cursor-pointer rounded-md bg-gray-300 px-2"
                    onClick={() => handleDecrease(product)}
                  >
                    -
                  </button>
                  <p className="border px-3">{product.quantity}</p>
                  <button
                    className="cursor-pointer rounded-md bg-gray-300 px-2"
                    onClick={() => handleIncrease(product)}
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  ราคา {product.price.toLocaleString()}/ชิ้น
                </p>
              </div>
              <div className="text-end">
                <button
                  onClick={() => removeFromCart(product)}
                  className="cursor-pointer"
                >
                  <MdDeleteOutline className="text-lg text-red-500" />
                </button>
                <p>{(product.price * product.quantity).toLocaleString()} ฿</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex h-[750px] w-full flex-col gap-2 rounded-lg bg-white p-4 shadow-md">
          <p className="mb-2 text-3xl font-semibold">สรุป</p>
          <p>ที่อยู่ในการจัดส่ง</p>
          <div className="rounded-lg border border-blue-300 bg-blue-50 p-2">
            {currentAddress ? (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <p className="font-bold">{currentAddress.name}</p>
                    <p>{currentAddress.phone}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setAddressModal(true)}
                      className="cursor-pointer text-blue-400"
                    >
                      เปลี่ยน
                    </button>
                  </div>
                </div>
                <p>{`${currentAddress.addressLine} ตำบล${currentAddress.subDistrict}, อำเภอ${currentAddress.district} จังหวัด${currentAddress.province} ${currentAddress.postalCode}`}</p>
              </div>
            ) : (
              <div>
                <a href="/user/address" className="text-red-500">
                  เพิ่มที่อยู่
                </a>
              </div>
            )}
          </div>

          <div className="flex justify-between border-b-1 pb-3">
            <p>{itemcart} ชิ้น:</p>
            <p>{total}฿</p>
          </div>
          <div className="flex justify-between border-b-1 pb-3">
            <p>ค่าจัดส่ง:</p>
            <p>0฿</p>
          </div>
          <div className="flex justify-between border-b-1 pb-3">
            <p>ภาษี:</p>
            <p>0฿</p>
          </div>
          <div className="mt-8 flex justify-between gap-2">
            <input
              type="text"
              className="w-full rounded border-2 px-3 py-2"
              placeholder="กรอกโค้ดส่วนลด"
            />
            <button className="shrink-0 cursor-pointer rounded border-1 border-black px-5 py-2">
              ใช้คูปอง
            </button>
          </div>
          <div className="mt-3 flex justify-between gap-2">
            <p>ยอดรวมย่อย:</p>
            <p>{total}฿</p>
          </div>
          <div className="flex justify-between gap-2">
            <p className="font-semibold">ยอดรวม:</p>
            <p>{total.toLocaleString()}฿</p>
          </div>
          <div className="mt-10 flex justify-between gap-2">
            <button
              onClick={() => handleSubmit()}
              className="w-full cursor-pointer rounded-full bg-black px-5 py-2 text-white"
            >
              สั่งสินค้า
            </button>
          </div>

          <Link
            to="/"
            className="w-full cursor-pointer rounded-full bg-white px-5 py-2 text-center shadow shadow-black/20"
          >
            เลือกสินค้าเพิ่ม
          </Link>
        </div>
      </div>
      {addressModal && (
        <AddressModal
          address={address}
          onClose={() => setAddressModal(false)}
          onSelect={(newAddress) => {
            setSelectedAddress(newAddress);
            setAddressModal(false);
          }}
          currentAddress={currentAddress}
        />
      )}
    </div>
  );
};
export default CartPage;
