// src/components/dashboard/RecentTransactions.tsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { useApp } from "../../state/AppState";
import {
  formatCurrency,
  formatDate,
  getCategoryColor,
} from "../../utils/formatters";

export const RecentTransactions: React.FC = () => {
  const { state } = useApp();

  // Get 5 most recent transactions
  const recentTransactions = [...state.transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Recent Transactions
        </h3>
        <Link
          to="/transactions"
          className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 flex items-center gap-1 font-medium"
        >
          View all
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: `${getCategoryColor(transaction.category)}20`,
                    color: getCategoryColor(transaction.category),
                  }}
                >
                  {transaction.type === "INCOME" ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(transaction.date)} • {transaction.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    transaction.type === "INCOME"
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {transaction.type === "INCOME" ? "+" : "-"}{" "}
                  {formatCurrency(transaction.amount)}
                </p>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    transaction.type === "INCOME"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {transaction.type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
