// src/components/transactions/TransactionSort.tsx
import React from "react";
import { ArrowUpDown, Calendar, DollarSign } from "lucide-react";
import { useApp } from "../../state/AppState";
import type { SortOption } from "../../types";

export const TransactionSort: React.FC = () => {
  const { state, dispatch } = useApp();

  const sortOptions: {
    value: SortOption;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      value: "newest",
      label: "Newest First",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      value: "oldest",
      label: "Oldest First",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      value: "highest",
      label: "Highest Amount",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      value: "lowest",
      label: "Lowest Amount",
      icon: <DollarSign className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
      <select
        value={state.sort}
        onChange={(e) =>
          dispatch({ type: "SET_SORT", payload: e.target.value as SortOption })
        }
        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer pr-8"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
