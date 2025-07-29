import { useAuth } from "../../context/AuthContext";

const OrderPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div className="my-8 rounded-lg bg-white p-6 shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">
        รายการคำสั่งซื้อของคุณ
      </h1>

      {user.orders.length === 0 ? (
        <p className="text-gray-600">คุณยังไม่มีคำสั่งซื้อ</p>
      ) : (
        user.orders.map((order) => (
          <div
            key={order._id}
            className="mb-5 mt-3 rounded-xl border p-4 shadow-sm transition hover:shadow-md"
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
