import { getOrdersCompleted } from "@/api/orders";
import { extractErrorMessage } from "@/utils/errorHelper";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getOrders = async () => {
    try {
      const response = await getOrdersCompleted();
      setOrders(response);
    } catch (error) {
      const message = extractErrorMessage(error);
      setError(message);
      toast.error(message);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="ml-3 rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-3xl font-bold text-gray-800">สรุปยอดขาย</h1>
    </div>
  );
};
export default DashboardPage;
