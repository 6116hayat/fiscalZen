// src/components/dashboard/BalanceTrendChart.tsx
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { useApp } from "../../state/AppState";
import { groupTransactionsByDate } from "../../utils/calculations";
import { formatCurrency } from "../../utils/formatters";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export const BalanceTrendChart: React.FC = () => {
  const { state } = useApp();

  const chartData = useMemo(() => {
    const { labels, income, expenses } = groupTransactionsByDate(
      state.transactions,
    );

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: income,
          borderColor: "#22C55E",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: "#22C55E",
        },
        {
          label: "Expenses",
          data: expenses,
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: "#EF4444",
        },
      ],
    };
  }, [state.transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += formatCurrency(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: any) {
            return formatCurrency(value);
          },
          font: {
            size: 11,
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          maxTicksLimit: 12,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  if (state.transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No transactions to display</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <Line data={chartData} options={options} />
    </div>
  );
};
