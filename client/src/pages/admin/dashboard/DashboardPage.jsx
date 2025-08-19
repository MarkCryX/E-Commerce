import { getDashboardStats } from "@/api/dashboard";
import { extractErrorMessage } from "@/utils/errorHelper";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const data = {
    labels: ["14/08", "15/08", "16/08", "17/08"],
    datasets: [
      {
        label: "ยอดขาย (บาท)",
        data: [2000, 3500, 1800, 5000],
        backgroundColor: "rgba(75,192,192,0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales Report",
      },
    },
  };


  return (
    <div className="ml-3 p-6">
      <div className="mb-10 grid grid-cols-1 gap-5 text-center md:grid-cols-4">
        <div className="rounded-md bg-white p-5 shadow-md">
          <h3>จำนวนออเดอร์สำเร็จทั้งหมด</h3>
          <p>{totalOrders} ออเดอร์</p>
        </div>
        <div className="rounded-md bg-white p-5 shadow-md">
          <h3>ยอดขายรวมทั้งหมด</h3>
          <p>{totalSales} บาท</p>
        </div>
        <div className="rounded-md bg-white p-5 shadow-md">
          <h3>จำนวนลูกค้าที่สั่งซื้อแล้ว (ไม่ซ้ำ)</h3>
          <p>{uniqueCustomers} คน</p>
        </div>
        <div className="rounded-md bg-white p-5 shadow-md">
          <h3>จำนวนสินค้ารวมที่ขายได้</h3>
          <p>{totalProducts} ชิ้น</p>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="w-full max-w-3xl rounded-md bg-white p-5 shadow-md">
          <Bar data={data} options={options} />
        </div>
        <div className="w-full max-w-3xl rounded-md bg-white p-5 shadow-md">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
