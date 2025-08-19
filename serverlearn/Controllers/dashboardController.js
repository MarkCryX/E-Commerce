const Order = require("../Models/Order");


exports.getDashboardStats = async (req, res) => {
  try {
    const orders = await Order.find({ isCompleted: true })
      .sort({
        createdAt: -1,
      })
      .select("-paymentSlip");

    const totalSales = orders.reduce(
      (total, order) => order.totalAmount + total,
      0
    );

    const totalOrders = orders.length;

    const uniqueCustomers = new Set(
      orders.map((order) => order.userId.toString())
    ).size;

    const totalProducts = orders.reduce(
      (total, order) =>
        total +
        order.products.reduce((sum, product) => sum + product.quantity, 0),
      0
    );

    const result = {
      summary: {
        totalOrders: totalOrders,
        totalSales: totalSales,
        uniqueCustomers: uniqueCustomers,
        totalProducts: totalProducts,
      },
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิฟเวอร์" });
  }
};

