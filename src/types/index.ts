// src/types/index.ts
export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionInput {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: TransactionType;
  tags: string[];
}

export interface Summary {
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  transactionCount: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type:
    | "HIGHEST_SPENDING"
    | "SAVINGS_RATE"
    | "MONTHLY_COMPARISON"
    | "LARGEST_EXPENSE";
  value?: number;
  percentage?: number;
  category?: string;
}

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills",
  "Health",
  "Education",
  "Other",
] as const;

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export interface TransactionFilters {
  search: string;
  type: "all" | "INCOME" | "EXPENSE";
  category: "all" | string;
}

export type SortOption = "newest" | "oldest" | "highest" | "lowest";
