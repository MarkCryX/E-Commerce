import { getDashboardStats } from "@/api/dashboard";
import { extractErrorMessage } from "@/utils/errorHelper";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SummaryCards from "@/components/Dashboard/SummaryCards";
import DashboardChart from "@/components/Dashboard/DashboardChart";
import {
  FaBoxOpen,
  FaDollarSign,
  FaShoppingCart,
  FaUsers,
} from "react-icons/fa";

const DashboardPage = () => {
  const [dataDashboard, setDataDashboard] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      const response = await getDashboardStats();
      setDataDashboard(response);
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = dataDashboard?.summary?.totalOrders || 0;
  const totalSales = dataDashboard?.summary?.totalSales || 0;
  const uniqueCustomers = dataDashboard?.summary?.uniqueCustomers || 0;
  const totalProducts = dataDashboard?.summary?.totalProducts || 0;

  //ยอดขายรายวัน
  const dailySalesLabels = Object.keys(dataDashboard.salesByDay || {});
  const dailySalesData = Object.values(dataDashboard.salesByDay || {});

  //ยอดขายรายเดือน
  const monthSalesLabels = Object.keys(dataDashboard.salesByMonth || {});
  const monthSalesData = Object.values(dataDashboard.salesByMonth || {});

  //จำนวนออเดอร์รายวัน
  const dailyOrdersLabels = Object.keys(dataDashboard.ordersByDay || {});
  const dailyOrdersData = Object.values(dataDashboard.ordersByDay || {});

  //จำนวนออเดอร์รายเดือน
  const monthOrdersLabels = Object.keys(dataDashboard.ordersByMonth || {});
  const monthOrdersData = Object.values(dataDashboard.ordersByMonth || {});

  //ยอดขายสินค้าตามหมวดหมู่
  const categorySalesLabels = Object.keys(dataDashboard.salesByCategory || {});
  const categorySalesData = Object.values(dataDashboard.salesByCategory || {});

  //สินค้าขายดีที่สุด 5 อันดับแรก
  const topSellingProducts = dataDashboard.topSellingProducts || [];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return (
    <div className="ml-3 p-6">
      <div className="mb-10 grid grid-cols-1 gap-5 text-center md:grid-cols-2 lg:grid-cols-4">
        <SummaryCards
          icon={<FaShoppingCart size={40} className="text-blue-500" />}
          title={"จำนวนออเดอร์สำเร็จทั้งหมด"}
          value={totalOrders}
          unit={"ออเดอร์"}
        />
        <SummaryCards
          icon={<FaDollarSign size={40} className="text-green-500" />}
          title={"ยอดขายรวมทั้งหมด"}
          value={totalSales}
          unit={"บาท"}
        />
        <SummaryCards
          icon={<FaUsers size={40} className="text-purple-500" />}
          title={"จำนวนลูกค้าที่สั่งซื้อแล้ว (ไม่ซ้ำ)"}
          value={uniqueCustomers}
          unit={"คน"}
        />
        <SummaryCards
          icon={<FaBoxOpen size={40} className="text-orange-500" />}
          title={"จำนวนสินค้ารวมที่ขายได้"}
          value={totalProducts}
          unit={"ชิ้น"}
        />
      </div>

      <div className="mb-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="max-w-4xl min-w-full rounded-md bg-white p-5 shadow-md">
          <DashboardChart
            title={"ยอดขายรายวัน"}
            labels={dailySalesLabels}
            data={dailySalesData}
            type={"line"}
          />
        </div>
        <div className="max-w-4xl min-w-full rounded-md bg-white p-5 shadow-md">
          <DashboardChart
            title={"ยอดขายรายเดือน"}
            labels={monthSalesLabels}
            data={monthSalesData}
            type={"line"}
          />
        </div>
      </div>
      <div className="mb-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="max-w-4xl min-w-full rounded-md bg-white p-5 shadow-md">
          <DashboardChart
            title={"จำนวนออเดอร์รายวัน"}
            labels={dailyOrdersLabels}
            data={dailyOrdersData}
            type={"bar"}
          />
        </div>
        <div className="max-w-4xl min-w-full rounded-md bg-white p-5 shadow-md">
          <DashboardChart
            title={"จำนวนออเดอร์รายเดือน"}
            labels={monthOrdersLabels}
            data={monthOrdersData}
            type={"bar"}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="max-w-xl min-w-full rounded-md bg-white p-5 shadow-md">
          <DashboardChart
            title={"ยอดขายสินค้าตามหมวดหมู่"}
            labels={categorySalesLabels}
            data={categorySalesData}
            type={"pie"}
          />
        </div>

        <div className="rounded-md bg-white p-5 shadow-md">
          <table className="min-w-full table-auto text-left text-sm text-gray-700">
            <caption className="mb-5 text-2xl">
              ตารางสินค้าขายดีที่สุด 5 อันดับ
            </caption>
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ชื่อสินค้า</th>
                <th className="border px-4 py-2">หมวดหมู่</th>
                <th className="border px-4 py-2">ขายได้</th>
                <th className="border px-4 py-2">ยอดขายทั้งหมดของสินค้า</th>
              </tr>
            </thead>
            <tbody>
              {topSellingProducts.map((product, index) => (
                <tr key={product.name} className="">
                  <td className="border px-4 py-2">
                    {index + 1}. {product.name}
                  </td>
                  <td className="border px-4 py-2">{product.category}</td>
                  <td className="border px-4 py-2">{product.totalQuantity} คู่</td>
                  <td className="border px-4 py-2">{product.totalRevenue.toLocaleString()} บาท</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
