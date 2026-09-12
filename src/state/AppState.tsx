import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { Transaction, TransactionFilters, SortOption } from "../types";
import { generateMockData } from "../data/mockData";
import { v4 as uuidv4 } from "uuid";

// State
interface AppState {
  transactions: Transaction[];
  role: "viewer" | "admin";
  filters: TransactionFilters;
  sort: SortOption;
  modal: {
    isOpen: boolean;
    mode: "add" | "edit" | null;
    transactionId: string | null;
  };
  confirmModal: {
    isOpen: boolean;
    transactionId: string | null;
  };
  isLoading: boolean;
  error: string | null;
}

// Actions
type AppAction =
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTION"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "SET_ROLE"; payload: "viewer" | "admin" }
  | { type: "SET_FILTERS"; payload: Partial<TransactionFilters> }
  | { type: "SET_SORT"; payload: SortOption }
  | {
      type: "SET_MODAL";
      payload: {
        isOpen: boolean;
        mode?: "add" | "edit" | null;
        transactionId?: string | null;
      };
    }
  | {
      type: "SET_CONFIRM_MODAL";
      payload: {
        isOpen: boolean;
        transactionId?: string | null;
      };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET_DATA" };

// Initial State
const getInitialTransactions = (): Transaction[] => {
  try {
    const stored = localStorage.getItem("finance_transactions");
    if (stored) {
      const parsed = JSON.parse(stored) as Transaction[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Failed to load transactions from localStorage:", error);
  }
  return generateMockData();
};

const initialState: AppState = {
  transactions: getInitialTransactions(),
  role: "viewer",
  filters: {
    search: "",
    type: "all",
    category: "all",
  },
  sort: "newest",
  modal: {
    isOpen: false,
    mode: null,
    transactionId: null,
  },
  confirmModal: {
    isOpen: false,
    transactionId: null,
  },
  isLoading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.payload };

    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };

    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };

    case "SET_ROLE":
      return { ...state, role: action.payload };

    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case "SET_SORT":
      return { ...state, sort: action.payload };

    case "SET_MODAL":
      return {
        ...state,
        modal: {
          isOpen: action.payload.isOpen,
          mode: action.payload.mode ?? null,
          transactionId: action.payload.transactionId ?? null,
        },
      };

    case "SET_CONFIRM_MODAL":
      return {
        ...state,
        confirmModal: {
          isOpen: action.payload.isOpen,
          transactionId: action.payload.transactionId ?? null,
        },
      };

    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "RESET_DATA":
      return { ...initialState, transactions: generateMockData() };

    default:
      return state;
  }
}

// Context
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Helper functions
  addTransaction: (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  // deleteTransaction: (id: string) => void;
  requestDelete: (id: string) => void;
  confirmDelete: () => void;
  getFilteredTransactions: () => Transaction[];
  getSummary: () => {
    balance: number;
    income: number;
    expenses: number;
    savings: number;
    count: number;
  };
  getInsights: () => any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  //persist transactions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "finance_transactions",
        JSON.stringify(state.transactions),
      );
    } catch (error) {
      console.warn("Failed to save transactions:", error);
    }
  }, [state.transactions]);

  //persist role
  useEffect(() => {
    localStorage.setItem("finance_role", state.role);
  }, [state.role]);

  // Helper: Add transaction
  const addTransaction = (
    transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  ) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
  };

  // Helper: Update transaction
  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    const existing = state.transactions.find((t) => t.id === id);
    if (!existing) return;

    const updated: Transaction = {
      ...existing,
      ...transaction,
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "UPDATE_TRANSACTION", payload: updated });
  };

  // Helper: Delete transaction
  // const deleteTransaction = (id: string) => {
  //   if (confirm("Are you sure you want to delete this transaction?")) {
  //     dispatch({ type: "DELETE_TRANSACTION", payload: id });
  //   }
  // };

  // Confirm-based delete (two-step)
  const requestDelete = (id: string) => {
    dispatch({
      type: "SET_CONFIRM_MODAL",
      payload: { isOpen: true, transactionId: id },
    });
  };

  const confirmDelete = () => {
    if (state.confirmModal.transactionId) {
      dispatch({
        type: "DELETE_TRANSACTION",
        payload: state.confirmModal.transactionId,
      });
    }
    dispatch({
      type: "SET_CONFIRM_MODAL",
      payload: { isOpen: false, transactionId: null },
    });
  };

  // Helper: Get filtered and sorted transactions
  const getFilteredTransactions = (): Transaction[] => {
    let filtered = [...state.transactions];

    // Apply search
    if (state.filters.search) {
      const search = state.filters.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(search) ||
          t.category.toLowerCase().includes(search) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(search)),
      );
    }

    // Apply type filter
    if (state.filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === state.filters.type);
    }

    // Apply category filter
    if (state.filters.category !== "all") {
      filtered = filtered.filter((t) => t.category === state.filters.category);
    }

    // Apply sorting
    switch (state.sort) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
        break;
      case "highest":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "lowest":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
    }

    return filtered;
  };

  // Helper: Get summary
  const getSummary = () => {
    const totalIncome = state.transactions
      .filter((t) => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = state.transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      balance: totalIncome - totalExpenses,
      income: totalIncome,
      expenses: totalExpenses,
      savings: totalIncome - totalExpenses,
      count: state.transactions.length,
    };
  };

  // Helper: Get insights
  const getInsights = () => {
    const transactions = state.transactions;
    const expenses = transactions.filter((t) => t.type === "EXPENSE");
    const income = transactions.filter((t) => t.type === "INCOME");

    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const insights = [];

    // Highest spending category
    const categorySpending = expenses.reduce(
      (acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    const highestCategory = Object.entries(categorySpending).sort(
      (a, b) => b[1] - a[1],
    )[0];

    if (highestCategory) {
      insights.push({
        id: "insight_1",
        title: "Highest Spending Category",
        description: `${highestCategory[0]} is your highest spending category.`,
        type: "HIGHEST_SPENDING",
        value: highestCategory[1],
        category: highestCategory[0],
      });
    }

    // Savings rate
    const savings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;

    insights.push({
      id: "insight_2",
      title: "Savings Rate",
      description: `You're saving ${savingsRate.toFixed(1)}% of your income.`,
      type: "SAVINGS_RATE",
      percentage: savingsRate,
      value: savings,
    });

    // Largest expense
    const largestExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0];
    if (largestExpense) {
      insights.push({
        id: "insight_3",
        title: "Largest Expense",
        description: `${largestExpense.description} — ₹${largestExpense.amount.toFixed(2)}`,
        type: "LARGEST_EXPENSE",
        value: largestExpense.amount,
        category: largestExpense.category,
      });
    }

    // Monthly comparison (simplified)
    insights.push({
      id: "insight_4",
      title: "Monthly Comparison",
      description:
        totalExpenses > 0
          ? `Your expenses are ${totalExpenses > 10000 ? "higher" : "lower"} than the average month.`
          : "No expenses recorded this month.",
      type: "MONTHLY_COMPARISON",
      percentage: totalExpenses > 0 ? 8 : 0,
    });

    return insights;
  };

  const value = {
    state,
    dispatch,
    addTransaction,
    updateTransaction,
    // deleteTransaction,
    requestDelete,
    confirmDelete,
    getFilteredTransactions,
    getSummary,
    getInsights,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
