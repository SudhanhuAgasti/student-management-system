import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function CourseDistributionChart({ courseStats = [] }) {
  const data = useMemo(() => ({
    labels: (courseStats || []).map(course => course._id || "Unassigned"),
    datasets: [
      {
        label: "Students per Course",
        data: (courseStats || []).map(course => course.count),
        backgroundColor: [
          "rgba(99, 102, 241, 0.85)",  
          "rgba(168, 85, 247, 0.85)", 
          "rgba(236, 72, 153, 0.85)", 
          "rgba(244, 63, 94, 0.85)",  
          "rgba(249, 115, 22, 0.85)",  
          "rgba(16, 185, 129, 0.85)", 
        ],
        borderColor: "white",
        borderWidth: 4,
        hoverOffset: 12,
        borderRadius: 8,
      },
    ],
  }), [courseStats]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%", 
    animation: {
      duration: 1500,
      easing: 'easeInSine'
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            family: "'Inter', sans-serif",
            size: 13,
            weight: "600",
          },
          color: "#475569", 
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)", 
        padding: 12,
        cornerRadius: 12,
        titleFont: { size: 14, weight: "bold", family: "'Inter', sans-serif" },
        bodyFont: { size: 13, family: "'Inter', sans-serif" },
        displayColors: false,
        callbacks: {
          label: (context) => `Students: ${context.parsed}`,
        },
      },
    },
  };

  return (
    <div className="w-full h-full p-4 relative flex items-center justify-center">
      <Doughnut data={data} options={options} />
      <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <h3 className="text-3xl font-black text-slate-800 leading-none">
            {courseStats.reduce((sum, c) => sum + (c.count || 0), 0)}
        </h3>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total</p>
      </div>
    </div>
  );
}

export default CourseDistributionChart;
