// src/pages/Insights.tsx
import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, TrendingUp, Target, Award } from "lucide-react";
import { useApp } from "../state/AppState";
import { InsightCard } from "../components/Insights/InsightCard";
import { formatCurrency } from "../utils/formatters";

export const Insights: React.FC = () => {
  const { state, getInsights, getSummary } = useApp();
  const insights = getInsights();
  const summary = getSummary();

  // Empty state
  if (state.transactions.length === 0) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Insights
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Personalized observations about your finances
          </p>
        </motion.div>

        <div className="card p-12 text-center">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
            💡
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No insights yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Add some transactions to see personalized insights
          </p>
        </div>
      </div>
    );
  }

  // Compute a health score based on savings rate
  const healthScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        summary.savings > 0
          ? (summary.savings / summary.income) * 100 * 2.5
          : 0,
      ),
    ),
  );
  const healthLabel =
    healthScore >= 75
      ? "Excellent"
      : healthScore >= 50
        ? "Good"
        : healthScore >= 25
          ? "Fair"
          : "Needs Attention";
  const healthColor =
    healthScore >= 75
      ? "text-green-500"
      : healthScore >= 50
        ? "text-primary-500"
        : healthScore >= 25
          ? "text-yellow-500"
          : "text-red-500";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Insights
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Personalized observations about your finances
          </p>
        </div>
      </motion.div>

      {/* Health Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-800"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30">
              <Award className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Financial Health
              </p>
              <h3 className={`text-3xl font-bold mt-1 ${healthColor}`}>
                {healthLabel}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Based on your savings rate and spending patterns
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-5xl font-bold ${healthColor}`}>{healthScore}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              out of 100
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${healthScore}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className={`h-full ${
              healthScore >= 75
                ? "bg-green-500"
                : healthScore >= 50
                  ? "bg-primary-500"
                  : healthScore >= 25
                    ? "bg-yellow-500"
                    : "bg-red-500"
            }`}
          />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-4 h-4 text-green-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Income
            </p>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(summary.income)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-4 h-4 text-red-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Expenses
            </p>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {formatCurrency(summary.expenses)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-4 h-4 text-primary-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Net Savings
            </p>
          </div>
          <p
            className={`text-2xl font-bold ${
              summary.savings >= 0
                ? "text-primary-600 dark:text-primary-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {formatCurrency(summary.savings)}
          </p>
        </motion.div>
      </div>

      {/* Insights Grid */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Detailed Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <InsightCard key={insight.id} insight={insight} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
