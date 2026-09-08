// src/utils/calculations.ts
import type { Transaction } from "../types";
import { formatShortDate } from "./formatters";

export const groupTransactionsByDate = (transactions: Transaction[]) => {
  const grouped = new Map<string, { income: number; expenses: number }>();

  // Sort by date
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Get date range
  if (sorted.length === 0) {
    return { labels: [], income: [], expenses: [] };
  }

  const startDate = new Date(sorted[0].date);
  const endDate = new Date(sorted[sorted.length - 1].date);

  // Generate all dates in range
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    grouped.set(dateStr, { income: 0, expenses: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fill data
  sorted.forEach((t) => {
    const data = grouped.get(t.date);
    if (data) {
      if (t.type === "INCOME") {
        data.income += t.amount;
      } else {
        data.expenses += t.amount;
      }
    }
  });

  // Extract labels and data
  const labels: string[] = [];
  const incomeData: number[] = [];
  const expensesData: number[] = [];

  grouped.forEach((value, key) => {
    labels.push(formatShortDate(key));
    incomeData.push(value.income);
    expensesData.push(value.expenses);
  });

  return { labels, income: incomeData, expenses: expensesData };
};

export const groupTransactionsByCategory = (transactions: Transaction[]) => {
  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const grouped = expenses.reduce(
    (acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Sort by amount (descending)
  const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  return {
    labels: sorted.map(([category]) => category),
    data: sorted.map(([, amount]) => amount),
  };
};
