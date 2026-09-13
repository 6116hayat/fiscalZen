// src/pages/Transactions.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../state/AppState";
import { useToast } from "../components/common/Toast";
import { TransactionFilters } from "../components/transactions/TransactionsFilters";
import { TransactionTable } from "../components/transactions/TransactionTable";
import { TransactionSort } from "../components/transactions/TransactionSort";
import { TransactionActions } from "../components/transactions/TransactionActions";
import { TransactionForm } from "../components/transactions/TransactionForm";
import { ExportButton } from "../components/transactions/ExportButton";
import { ConfirmModal } from "../components/common/ConfirmModal";

import { usePermissions } from "../hooks/usePermissions";
import { Eye } from "lucide-react";

import type { Transaction } from "../types";

export const Transactions: React.FC = () => {
  const { state, dispatch, getFilteredTransactions, confirmDelete } = useApp();
  const { showToast } = useToast();

  //Viewer Mode
  const { isViewer } = usePermissions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const filteredTransactions = getFilteredTransactions();

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingTransaction(null);
  };

  const handleFormSuccess = (message: string) => {
    showToast(message, "success");
  };

  const handleConfirmDelete = () => {
    confirmDelete();
    showToast("Transaction deleted successfully", "success");
  };

  const handleCancelDelete = () => {
    dispatch({
      type: "SET_CONFIRM_MODAL",
      payload: { isOpen: false, transactionId: null },
    });
  };

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
            Transactions
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filteredTransactions.length} transactions found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton />
          <TransactionActions onAdd={handleAdd} />
        </div>
      </motion.div>

      {/* Viewer Mode: informational banner shown only to viewer */}
      {isViewer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
        >
          <Eye className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            You're viewing in <strong>Viewer mode</strong>. Switch to{" "}
            <strong>Admin</strong> in the header to add, edit, or delete
            transactions.
          </p>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <TransactionFilters />
          </div>
          <div className="lg:ml-auto">
            <TransactionSort />
          </div>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-4 md:p-6"
      >
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEdit}
        />
      </motion.div>

      {/* Modal */}
      <TransactionForm
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editTransaction={editingTransaction}
        onSuccess={handleFormSuccess}
      />

      {/* confirmModal */}
      <ConfirmModal
        isOpen={state.confirmModal.isOpen}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        variant="danger"
      />
    </div>
  );
};
