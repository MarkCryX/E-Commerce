import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  fetchOrders,
  genQRCodeForOrder,
  uploadPaymentSlip,
} from "@/api/orders";
import { RxCross1 } from "react-icons/rx";

const OrderPage = () => {
  const { user, loading } = useAuth();
  const [ordersData, setOrdersData] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [modalQrcode, setModalQrcode] = useState(false);
  const [imgQRCode, setImgQRCode] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentSlipBase64, setPaymentSlipBase64] = useState("");

  const handleOpenModal = async (order) => {
    setSelectedOrder(order);
    setModalQrcode(true);
    setImgQRCode("");
    try {
      const response = await genQRCodeForOrder(order._id);
      setImgQRCode(response.qrCodeData);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึง QR Code", error);
    }
  };

  const handleSlipChange = async (event, orderId) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const slipUrl = reader.result;
      setPaymentSlipBase64(slipUrl);
      try {
        const res = await uploadPaymentSlip(orderId, slipUrl);
        console.log(res.message);
      } catch (err) {
        console.error("อัปโหลดสลิปล้มเหลว", err);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchOrders();
        setOrdersData(response);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดขณะโหลดคำสั่งซื้อ", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [user, paymentSlipBase64]);

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div className="my-8 rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">
        รายการคำสั่งซื้อของคุณ
      </h1>

      {ordersData.length === 0 ? (
        <p className="text-gray-600">คุณยังไม่มีคำสั่งซื้อ</p>
      ) : (
        ordersData.map((order) => (
          <div
            key={order._id}
            className="mt-3 mb-5 rounded-xl border p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-2 flex justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  วันที่สั่ง: {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  สถานะ: <span className="font-semibold">{order.status}</span>
                </p>
                <p className="text-sm text-gray-600">
                  วิธีชำระเงิน:{" "}
                  <span className="font-semibold">
                    {order.payment === "cod"
                      ? "ชำระเงินปลายทาง"
                      : "พร้อมเพย์ / QR Code"}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  สถานะชำระเงิน:{" "}
                  <span className="font-semibold">{order.paymentstatus}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">ยอดรวม</p>
                <p className="text-xl font-bold text-green-600">
                  {order.totalAmount.toLocaleString()} ฿
                </p>
              </div>
            </div>

            <div className="space-y-3 divide-y">
              {order.products.map((item) => (
                <div key={item._id} className="flex gap-4 py-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 rounded object-cover"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      สี: {item.color} | ไซส์: {item.size}
                    </p>
                    <p className="text-sm text-gray-600">
                      จำนวน: {item.quantity} | ราคา:{" "}
                      {item.price.toLocaleString()} ฿
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                จัดส่งไปยัง: {order.shippingAddress.name},{" "}
                {order.shippingAddress.addressLine},{" "}
                {order.shippingAddress.subDistrict},{" "}
                {order.shippingAddress.district},{" "}
                {order.shippingAddress.province}{" "}
                {order.shippingAddress.postalCode}
              </div>
              {order.payment === "promptpay" &&
              order.paymentstatus === "รอชำระ" ? (
                <div className="flex gap-2">
                  <button
                    className="cursor-pointer rounded-lg bg-blue-500 px-3 py-2 text-white"
                    onClick={() => handleOpenModal(order)}
                  >
                    ชำระเงิน
                  </button>

                  {/* ปุ่มอัปโหลดสลิป */}
                  <label className="cursor-pointer rounded-lg bg-green-500 px-3 py-2 text-white">
                    อัปโหลดสลิป
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSlipChange(e, order._id)}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : null}
            </div>

            {/* แสดงตัวอย่างสลิปที่อัปโหลด */}
            {order.paymentSlip && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">สลิปที่อัปโหลด:</p>
                <img
                  src={order.paymentSlip}
                  alt="Payment Slip"
                  className="mt-1 h-40 rounded-lg border"
                />
              </div>
            )}
          </div>
        ))
      )}

      {modalQrcode && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6">
            <h1 className="text-center text-xl font-medium">สแกนชำระเงิน</h1>
            <div className="flex flex-col items-center justify-center space-y-4">
              <p className="text-gray-600">
                ยอดที่ต้องชำระ:{" "}
                <span className="font-bold text-green-600">
                  {selectedOrder.totalAmount.toLocaleString()} ฿
                </span>
              </p>
              {imgQRCode ? (
                <img
                  src={imgQRCode}
                  alt="PromptPay QR Code"
                  className="h-64 w-64 rounded-xl p-4 shadow-inner"
                />
              ) : (
                <div className="flex h-64 w-64 items-center justify-center text-gray-400">
                  <p>กำลังสร้าง QR Code...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
