import { Bar, Line, Pie } from "react-chartjs-2";
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
  ArcElement,
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
  ArcElement,
);

export default function DashboardChart({ title, labels, data, type }) {
  const defaultColors = [
    "rgba(255, 99, 132, 0.9)",
    "rgba(54, 162, 235, 0.9)",
    "rgba(255, 206, 86, 0.9)",
    "rgba(75, 192, 192, 0.9)",
    "rgba(153, 102, 255, 0.9)",
    "rgba(255, 159, 64, 0.9)",
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: title,
        data,
        backgroundColor:
          type === "bar"
            ? "rgba(75,192,192,0.5)"
            : type === "pie"
              ? defaultColors
              : "transparent",
        borderColor: type === "pie" ? "white" : "rgba(75,192,192,1)",
        fill: type === "line",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: type === "pie" ? "right" : "top" },
      title: { display: true, text: title },
    },
  };

  if (type === "line") return <Line data={chartData} options={chartOptions} />;
  if (type === "bar") return <Bar data={chartData} options={chartOptions} />;
  if (type === "pie") return <Pie data={chartData} options={chartOptions} />;
}
