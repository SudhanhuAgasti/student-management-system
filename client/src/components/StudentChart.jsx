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
import { useMemo } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StudentChart({ students = 0, attendance = 0, fees = 0 }) {
  const data = useMemo(() => ({
    labels: ["Students", "Attendance", "Transactions"],
    datasets: [
      {
        label: "Institute Metrics",
        data: [students, attendance, fees],
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return null;
          
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          
          // Index based colors for variety
          if (context.dataIndex === 0) {
            gradient.addColorStop(0, "rgba(99, 102, 241, 0.8)"); // Indigo
            gradient.addColorStop(1, "rgba(168, 85, 247, 0.9)"); // Purple
          } else if (context.dataIndex === 1) {
            gradient.addColorStop(0, "rgba(16, 185, 129, 0.8)"); // Emerald
            gradient.addColorStop(1, "rgba(5, 150, 105, 0.9)"); // Green
          } else {
            gradient.addColorStop(0, "rgba(236, 72, 153, 0.8)"); // Pink
            gradient.addColorStop(1, "rgba(244, 63, 94, 0.9)"); // Rose
          }
          return gradient;
        },
        borderRadius: 12,
        borderSkipped: false,
        hoverBackgroundColor: (context) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
            if (context.dataIndex === 0) {
                gradient.addColorStop(0, "rgba(99, 102, 241, 1)");
                gradient.addColorStop(1, "rgba(168, 85, 247, 1)");
            } else if (context.dataIndex === 1) {
                gradient.addColorStop(0, "rgba(16, 185, 129, 1)");
                gradient.addColorStop(1, "rgba(5, 150, 105, 1)");
            } else {
                gradient.addColorStop(0, "rgba(236, 72, 153, 1)");
                gradient.addColorStop(1, "rgba(244, 63, 94, 1)");
            }
            return gradient;
        },
        maxBarThickness: 60,
      },
    ],
  }), [students, attendance, fees]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 2000,
        easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: false, // Hide legend for a cleaner look since labels are on X axis
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)", // Dark slate
        titleFont: { size: 14, weight: "bold", family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Count: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b", // slate-500
          font: {
            size: 13,
            weight: "600",
            family: "'Inter', sans-serif",
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(226, 232, 240, 0.6)", // slate-200
          drawBorder: false,
        },
        ticks: {
          color: "#94a3b8", // slate-400
          stepSize: 1,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4">
      <Bar data={data} options={options} />
    </div>
  );
}

export default StudentChart;