// src/utils/export.ts
import type { Transaction } from "../types";

export const exportToCSV = (
  transactions: Transaction[],
  filename = "transactions.csv",
) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount"];

  const rows = transactions.map((t) => [
    t.date,
    `"${t.description.replace(/"/g, '""')}"`, // Escape quotes
    t.category,
    t.type,
    t.amount.toFixed(2),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
