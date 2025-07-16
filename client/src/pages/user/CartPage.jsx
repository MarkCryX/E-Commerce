import { useCart } from "@/context/CartContext";
import { MdDeleteOutline } from "react-icons/md";
import { Link, NavLink } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, addToCart, handleIncrease, handleDecrease } =
    useCart();

  const total = cart
    .reduce((total, item) => item.quantity * item.price + total, 0)
    .toLocaleString();

  const itemcart = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 gap-5 pt-5">
        <div className="h-[750px] w-full overflow-y-scroll rounded-lg bg-white p-4 shadow-md">
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
                <img
                  src={product.image}
                  alt=""
                  className="h-16 "
                />
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
            <p>{total}฿</p>
          </div>
          <div className="mt-10 flex justify-between gap-2">
            <button className="w-full cursor-pointer rounded-full bg-black px-5 py-2 text-white">
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
    </div>
  );
};
export default CartPage;
