// src/components/transactions/TransactionActions.tsx
import React from "react";
import { Plus } from "lucide-react";
import { useApp } from "../../state/AppState";

interface TransactionActionsProps {
  onAdd: () => void;
}

export const TransactionActions: React.FC<TransactionActionsProps> = ({
  onAdd,
}) => {
  const { state } = useApp();

  return (
    <div className="flex items-center gap-3">
      {state.role === "admin" && (
        <button
          onClick={onAdd}
          className="btn-primary flex items-center gap-2 px-4 py-2"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      )}
    </div>
  );
};
