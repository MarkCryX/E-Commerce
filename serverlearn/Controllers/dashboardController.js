const Order = require("../Models/Order");

exports.getDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find({ isCompleted: true })
      .sort({
        createdAt: 1,
      })
      .select("-paymentSlip");

    //จำนวนออเดอร์สำเร็จทั้งหมด
    const totalOrders = orders.length;

    //ยอดขายรวมทั้งหมด
    const totalSales = orders.reduce(
      (total, order) => order.totalAmount + total,
      0
    );

    //จำนวนลูกค้าที่สั่งซื้อแล้ว(ไม่ซ้ำ)
    const uniqueCustomers = new Set(
      orders.map((order) => order.userId.toString())
    ).size;

    //จำนวนสินค้ารวมที่ขายได้
    const totalProducts = orders.reduce(
      (total, order) =>
        total +
        order.products.reduce((sum, product) => sum + product.quantity, 0),
      0
    );

    // ยอดขายรายวัน
    const salesByDay = orders.reduce((acc, order) => {
      const day = order.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!acc[day]) acc[day] = 0;
      acc[day] += order.totalAmount;
      return acc;
    }, {});

    // ยอดขายรายเดือน
    const salesByMonth = orders.reduce((acc, order) => {
      const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) acc[month] = 0;
      acc[month] += order.totalAmount;
      return acc;
    }, {});

    // จำนวนออเดอร์รายวัน
    const ordersByDay = orders.reduce((acc, order) => {
      const day = order.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD
      if (!acc[day]) acc[day] = 0;
      acc[day]++;
      return acc;
    }, {});

    // จำนวนออเดอร์รายเดือน
    const ordersByMonth = orders.reduce((acc, order) => {
      const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) acc[month] = 0;
      acc[month]++;
      return acc;
    }, {});

    // ยอดขายตามหมวดหมู่
    const salesByCategory = orders.reduce((acc, order) => {
      order.products.forEach((product) => {
        const category = product.category; // ใช้ชื่อสินค้าเป็น key
        const sales = product.price * product.quantity; // ยอดขาย = ราคา x จำนวน

        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += sales;
      });

      return acc;
    }, {});

    const result = {
      summary: {
        totalOrders: totalOrders,
        totalSales: totalSales,
        uniqueCustomers: uniqueCustomers,
        totalProducts: totalProducts,
      },
      salesByDay,
      salesByMonth,
      ordersByDay,
      ordersByMonth,
      salesByCategory,
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิฟเวอร์" });
  }
};
