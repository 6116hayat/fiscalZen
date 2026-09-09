// src/components/dashboard/SummaryCards.tsx
import React from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../../state/AppState";
import { formatCurrency } from "../../utils/formatters";

export const SummaryCards: React.FC = () => {
  const { getSummary } = useApp();
  const summary = getSummary();

  const cards = [
    {
      title: "Total Balance",
      value: summary.balance,
      icon: Wallet,
      color: "text-primary-500",
      bgColor: "bg-primary-50 dark:bg-primary-900/20",
      trend: summary.balance > 0 ? "+8.4%" : "-2.1%",
      trendPositive: summary.balance > 0,
    },
    {
      title: "Total Income",
      value: summary.income,
      icon: ArrowUpRight,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      trend: "↑ 12.5%",
      trendPositive: true,
    },
    {
      title: "Total Expenses",
      value: summary.expenses,
      icon: ArrowDownRight,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      trend: "↑ 5.2%",
      trendPositive: false,
    },
    {
      title: "Savings",
      value: summary.savings,
      icon: PiggyBank,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      trend: summary.savings > 0 ? "↑ 15.3%" : "↓ 0%",
      trendPositive: summary.savings > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card p-6"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                {formatCurrency(card.value)}
              </p>
              <div className="flex items-center mt-2 space-x-2">
                <span
                  className={`text-sm font-medium ${
                    card.trendPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {card.trend}
                </span>
                <span className="text-xs text-gray-400">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${card.bgColor}`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
