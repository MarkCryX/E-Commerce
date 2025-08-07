import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchOrderById } from "@/api/orders";

const OrderPage = () => {
  const { user, loading } = useAuth();
  const [ordersData, setOrdersData] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetchOrderById();
        setOrdersData(response);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดขณะโหลดคำสั่งซื้อ", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    loadOrders();
  }, [user]);

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

            <div className="mt-4 text-sm text-gray-500">
              จัดส่งไปยัง: {order.shippingAddress.name},{" "}
              {order.shippingAddress.addressLine},{" "}
              {order.shippingAddress.subDistrict},{" "}
              {order.shippingAddress.district}, {order.shippingAddress.province}{" "}
              {order.shippingAddress.postalCode}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderPage;
