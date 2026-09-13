// src/utils/insights.ts
import type { Transaction, Insight } from "../types";

export const calculateInsights = (transactions: Transaction[]): Insight[] => {
  const insights: Insight[] = [];

  if (transactions.length === 0) {
    return insights;
  }

  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const income = transactions.filter((t) => t.type === "INCOME");

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  // 1. Highest Spending Category
  if (expenses.length > 0) {
    const categorySpending = expenses.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const sorted = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);
    const [topCategory, topAmount] = sorted[0];
    const percentage =
      totalExpenses > 0 ? (topAmount / totalExpenses) * 100 : 0;

    insights.push({
      id: "insight_highest_spending",
      title: "Highest Spending Category",
      description: `${topCategory} accounts for ${percentage.toFixed(1)}% of your total expenses.`,
      type: "HIGHEST_SPENDING",
      value: topAmount,
      percentage,
      category: topCategory,
    });
  }

  // 2. Savings Rate
  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

  insights.push({
    id: "insight_savings_rate",
    title: "Savings Rate",
    description:
      savingsRate >= 20
        ? `Excellent! You're saving ${savingsRate.toFixed(1)}% of your income.`
        : savingsRate > 0
          ? `You're saving ${savingsRate.toFixed(1)}% of your income. Aim for 20%.`
          : `You're spending more than you earn. Time to review your expenses.`,
    type: "SAVINGS_RATE",
    value: savings,
    percentage: savingsRate,
  });

  // 3. Largest Single Expense
  if (expenses.length > 0) {
    const largest = [...expenses].sort((a, b) => b.amount - a.amount)[0];
    insights.push({
      id: "insight_largest_expense",
      title: "Largest Expense",
      description: `${largest.description} — ₹${largest.amount.toFixed(2)} on ${new Date(
        largest.date,
      ).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`,
      type: "LARGEST_EXPENSE",
      value: largest.amount,
      category: largest.category,
    });
  }

  // 4. Monthly Comparison (compare current month vs previous month)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = expenses
    .filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const prevMonthExpenses = expenses
    .filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  if (prevMonthExpenses > 0) {
    const change =
      ((currentMonthExpenses - prevMonthExpenses) / prevMonthExpenses) * 100;
    insights.push({
      id: "insight_monthly_comparison",
      title: "Monthly Comparison",
      description:
        change < 0
          ? `Your expenses are ${Math.abs(change).toFixed(1)}% lower than last month. Keep it up!`
          : `Your expenses are ${change.toFixed(1)}% higher than last month.`,
      type: "MONTHLY_COMPARISON",
      percentage: change,
    });
  } else {
    insights.push({
      id: "insight_monthly_comparison",
      title: "Monthly Comparison",
      description:
        "No expenses were recorded last month, so a comparison isn't available.",
      type: "MONTHLY_COMPARISON",
      percentage: 0,
    });
  }

  return insights;
};
