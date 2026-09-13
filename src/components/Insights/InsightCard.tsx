// src/components/insights/InsightCard.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Flame,
  PiggyBank,
  CreditCard,
  TrendingDown,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import type { Insight } from "../../types";
import { formatCurrency } from "../../utils/formatters";

interface InsightCardProps {
  insight: Insight;
  index: number;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight, index }) => {
  const config = {
    HIGHEST_SPENDING: {
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      label: "Top Category",
    },
    SAVINGS_RATE: {
      icon: PiggyBank,
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      label: "Savings",
    },
    LARGEST_EXPENSE: {
      icon: CreditCard,
      color: "text-red-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      label: "Largest Expense",
    },
    MONTHLY_COMPARISON: {
      icon:
        insight.percentage !== undefined && insight.percentage < 0
          ? TrendingDown
          : TrendingUp,
      color:
        insight.percentage !== undefined && insight.percentage < 0
          ? "text-green-500"
          : "text-blue-500",
      bg:
        insight.percentage !== undefined && insight.percentage < 0
          ? "bg-green-50 dark:bg-green-900/20"
          : "bg-blue-50 dark:bg-blue-900/20",
      label: "Monthly Trend",
    },
  }[insight.type];

  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card p-6 hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${config.bg} flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {config.label}
          </p>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-1">
            {insight.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            {insight.description}
          </p>

          {/* Value Display */}
          {insight.value !== undefined && insight.type !== "SAVINGS_RATE" && (
            <p className={`text-xl font-bold mt-3 ${config.color}`}>
              {formatCurrency(insight.value)}
            </p>
          )}

          {insight.type === "SAVINGS_RATE" &&
            insight.percentage !== undefined && (
              <div className="mt-3">
                <p
                  className={`text-2xl font-bold ${
                    insight.percentage >= 20
                      ? "text-green-500"
                      : insight.percentage > 0
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {insight.percentage.toFixed(1)}%
                </p>
                {insight.value !== undefined && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatCurrency(insight.value)} saved
                  </p>
                )}
              </div>
            )}

          {insight.type === "MONTHLY_COMPARISON" &&
            insight.percentage !== undefined &&
            insight.percentage !== 0 && (
              <p
                className={`text-2xl font-bold mt-3 ${
                  insight.percentage < 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {insight.percentage > 0 ? "+" : ""}
                {insight.percentage.toFixed(1)}%
              </p>
            )}
        </div>
      </div>
    </motion.div>
  );
};
