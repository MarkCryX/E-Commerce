import { fetchOrdersAdmin } from "@/api/orders";
import { useEffect, useState } from "react";
import { updateStatusOrder } from "@/api/orders";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await updateStatusOrder(id, status);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchOrdersAdmin();
        setOrders(response);
      } catch (error) {
        console.error(error);
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
                <div>
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
                    <option value="ยกเลิก">ยกเลิก</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default ManageOrders;
