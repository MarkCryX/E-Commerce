import { fetchOrdersAdmin } from "@/api/orders";
import { useEffect, useState } from "react";
import {
  updateStatusOrder,
  updatePaymemtStatus,
  closeOrder,
} from "@/api/orders";
import { RxCross1 } from "react-icons/rx";
import { toast } from "react-toastify";
import { extractErrorMessage } from "@/utils/errorHelper";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalSlip, setModalSlip] = useState(false);
  const [error, setError] = useState(null);
  const [slip, setSlip] = useState("");

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await updateStatusOrder(id, status);
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? response : order)),
      );
      toast.success("อัพเดทสถานะคำสั่งซื้อสำเร็จ");
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    }
  };

  const handleUpdatePaymentStatus = async (id, paymentstatus) => {
    try {
      const response = await updatePaymemtStatus(id, paymentstatus);
      setOrders((prev) =>
        prev.map((order) => (order._id === id ? response : order)),
      );
      toast.success("อัพเดทสถานะการชำระเงินสำเร็จ");
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    }
  };

  const handleOpenSlip = (slipUrl) => {
    setSlip(slipUrl);
    setModalSlip(true);
  };

  const handleCloseOrder = async (id) => {
    try {
      const response = await closeOrder(id);
      setOrders((prev) =>
        prev
          .map((order) => (order._id === id ? response : order))
          .filter((order) => !order.isCompleted),
      );
      toast.success("ปิดคำสั่งซื้อสำเร็จ");
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchOrdersAdmin();
        setOrders(response);
      } catch (error) {
        const message = extractErrorMessage(error);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="ml-3 rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">จัดการออเดอร์</h1>
      {orders.length === 0 ? (
        <p className="text-center">ยังไม่มีคำสั่งซื้อ</p>
      ) : (
        orders.map((order) => (
          <div key={order._id}>
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
                    ชำระเงิน:{" "}
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

              <div className="flex justify-between">
                <div className="mt-4 text-sm text-gray-500">
                  จัดส่งไปยัง: {order.shippingAddress.name},{" "}
                  {order.shippingAddress.addressLine},{" "}
                  {order.shippingAddress.subDistrict},{" "}
                  {order.shippingAddress.district},{" "}
                  {order.shippingAddress.province}{" "}
                  {order.shippingAddress.postalCode}
                </div>
                {order.paymentstatus === "ชำระเสร็จสิ้น" && (
                  <div className="flex items-center gap-2">
                    <p>อัพเดทสถานะออเดอร์: </p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order._id, e.target.value)
                      }
                      className="rounded border px-2 py-1"
                    >
                      <option value="รอดำเนินการ">รอดำเนินการ</option>
                      <option value="กำลังจัดเตรียมสินค้า">
                        กำลังจัดเตรียมสินค้า
                      </option>
                      <option value="พร้อมจัดส่ง">พร้อมจัดส่ง</option>
                      <option value="จัดส่งแล้ว">จัดส่งแล้ว</option>
                      <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                    </select>

                    {order.status === "เสร็จสิ้น" && (
                      <button
                        className="cursor-pointer rounded-sm bg-green-500 px-2 py-1 font-light text-white"
                        onClick={() => handleCloseOrder(order._id)}
                      >
                        ปิดคำสั่งซื้อ
                      </button>
                    )}
                  </div>
                )}
              </div>

              {order.paymentstatus === "กำลังตรวจสอบการชำระเงิน" && (
                <div className="mt-3 flex justify-between gap-3">
                  <button
                    className="cursor-pointer rounded-sm bg-blue-500 px-2 py-1 font-light text-white"
                    onClick={() => handleOpenSlip(order.paymentSlip)}
                  >
                    ดูสลิป
                  </button>
                  <div className="flex items-center gap-2">
                    <p>อัพเดทสถานะชำระเงิน: </p>
                    <select
                      value={order.paymentstatus}
                      onChange={(e) =>
                        handleUpdatePaymentStatus(order._id, e.target.value)
                      }
                      className="rounded border px-2 py-1"
                    >
                      <option value="กำลังตรวจสอบการชำระเงิน">
                        กำลังตรวจสอบการชำระเงิน
                      </option>
                      <option value="ชำระเสร็จสิ้น">ชำระเสร็จสิ้น</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      {modalSlip && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-6">
            <button
              onClick={() => setModalSlip(false)}
              className="absolute top-3 right-5 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-300"
            >
              <RxCross1 className="h-5 w-5" />
            </button>
            {slip ? (
              <img src={slip} alt="" height={500} width={500} />
            ) : (
              <p>ยังไม่มีสลิป</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageOrders;
