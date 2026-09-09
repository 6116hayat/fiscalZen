// src/components/dashboard/SpendingBreakdownChart.tsx
import React, { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useApp } from "../../state/AppState";
import { groupTransactionsByCategory } from "../../utils/calculations";
import { getCategoryColor, formatCurrency } from "../../utils/formatters";

ChartJS.register(ArcElement, Tooltip, Legend);

export const SpendingBreakdownChart: React.FC = () => {
  const { state } = useApp();

  const chartData = useMemo(() => {
    const { labels, data } = groupTransactionsByCategory(state.transactions);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: labels.map((cat) => getCategoryColor(cat)),
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    };
  }, [state.transactions]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0,
            );
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
  };

  if (state.transactions.filter((t) => t.type === "EXPENSE").length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No expenses to display</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};
