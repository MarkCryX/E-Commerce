import { fetchOrdersAdmin } from "@/api/orders";
import { useEffect, useState } from "react";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchOrdersAdmin();
        setOrders(response);
      } catch (error) {
        console.error(error);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="ml-3 rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">จัดการออเดอร์</h1>
      <div>
        {orders.map((order) => (
          <div key={order._id}>
            <h1>ผู้สั่งซื้อ: {order.shippingAddress.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ManageOrders;
