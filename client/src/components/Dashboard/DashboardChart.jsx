import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  LineElement,
);

export default function DashboardChart({title, labels, data, type}) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor: type === "bar" ? "rgba(75,192,192,0.5)" : "transparent",
        borderColor: "rgba(75,192,192,1)",
        fill: type === "line",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: title },
    },
  };

  return type === "line" ? (
    <Line data={chartData} options={chartOptions} />
  ) : (
    <Bar data={chartData} options={chartOptions} />
  );
}
