// // src/pages/Dashboard.tsx
// import React from "react";

// export const Dashboard: React.FC = () => {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
//         Dashboard
//       </h2>
//       <div className="card p-8">
//         <p className="text-gray-500 dark:text-gray-400">
//           Dashboard content coming in Phase 2...
//         </p>
//       </div>
//     </div>
//   );
// };

// src/pages/Dashboard.tsx
import React from "react";
import { motion } from "framer-motion";
import { useApp } from "../state/AppState";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { BalanceTrendChart } from "../components/dashboard/BalanceTrendChart";
import { SpendingBreakdownChart } from "../components/dashboard/SpendingBreakdownChart";
import { RecentTransactions } from "../components/dashboard/RecentTransactions";

export const Dashboard: React.FC = () => {
  const { state } = useApp();

  // Get time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Header with greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {getGreeting()} 👋
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here's your financial overview for{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {state.transactions.length} transactions total
        </div>
      </motion.div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Income vs Expenses
          </h3>
          <BalanceTrendChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Spending Breakdown
          </h3>
          <SpendingBreakdownChart />
        </motion.div>
      </div>

      {/* Recent Transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <RecentTransactions />
      </motion.div>
    </div>
  );
};
