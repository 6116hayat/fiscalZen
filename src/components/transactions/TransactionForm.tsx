// src/components/transactions/TransactionForm.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { useApp } from "../../state/AppState";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../../types";
import type {
  Transaction,
  TransactionInput,
  TransactionType,
} from "../../types";
import { motion, AnimatePresence } from "framer-motion";

const transactionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  type: z.enum(["INCOME", "EXPENSE"]),
  tags: z.string().optional(),
});

type FormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  isOpen,
  onClose,
  editTransaction,
}) => {
  const { addTransaction, updateTransaction } = useApp();
  const isEdit = !!editTransaction;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      description: "",
      category: "",
      amount: 0,
      type: "EXPENSE",
      tags: "",
    },
  });

  const type = watch("type");

  useEffect(() => {
    if (editTransaction) {
      reset({
        date: editTransaction.date,
        description: editTransaction.description,
        category: editTransaction.category,
        amount: editTransaction.amount,
        type: editTransaction.type,
        tags: editTransaction.tags?.join(",") || "",
      });
    } else {
      reset({
        date: new Date().toISOString().split("T")[0],
        description: "",
        category: "",
        amount: 0,
        type: "EXPENSE",
        tags: "",
      });
    }
  }, [editTransaction, reset]);

  const onSubmit = (data: FormData) => {
    const transactionData: TransactionInput = {
      date: data.date,
      description: data.description,
      category: data.category,
      amount: data.amount,
      type: data.type,
      tags: data.tags
        ? data.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : [],
    };

    if (isEdit && editTransaction) {
      updateTransaction(editTransaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    onClose();
  };

  const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-premium max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {isEdit ? "Edit Transaction" : "Add Transaction"}
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                {/* Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <div className="flex gap-2">
                    {(["EXPENSE", "INCOME"] as TransactionType[]).map(
                      (typeOption) => (
                        <button
                          key={typeOption}
                          type="button"
                          onClick={() => setValue("type", typeOption)}
                          className={`flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                            type === typeOption
                              ? typeOption === "INCOME"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-2 ring-green-500"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-2 ring-red-500"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {typeOption}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <input
                    {...register("description")}
                    className="input-field"
                    placeholder="e.g., Grocery Store"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    {...register("category")}
                    className="input-field appearance-none"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    {...register("amount", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="input-field"
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    {...register("date")}
                    type="date"
                    className="input-field"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>

                  <input
                    {...register("tags")}
                    className="input-field"
                    placeholder="e.g. food, business, monthly"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Separate tags with commas
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-primary"
                  >
                    {isSubmitting ? "Saving..." : isEdit ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
