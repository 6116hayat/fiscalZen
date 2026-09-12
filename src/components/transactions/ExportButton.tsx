// src/components/transactions/ExportButton.tsx
import React from "react";
import { Download } from "lucide-react";
import { useApp } from "../../state/AppState";
import { useToast } from "../common/Toast";
import { exportToCSV } from "../../utils/export";

export const ExportButton: React.FC = () => {
  const { getFilteredTransactions } = useApp();
  const { showToast } = useToast();

  const handleExport = () => {
    const transactions = getFilteredTransactions();
    if (transactions.length === 0) {
      showToast("No transactions to export", "error");
      return;
    }
    exportToCSV(transactions);
    showToast(`Exported ${transactions.length} transactions`, "success");
  };

  return (
    <button
      onClick={handleExport}
      className="btn-secondary flex items-center gap-2 px-4 py-2"
    >
      <Download className="w-4 h-4" />
      Export CSV
    </button>
  );
};
