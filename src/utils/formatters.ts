// src/utils/formatters.ts
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Food: "#EF4444",
    Transport: "#3B82F6",
    Shopping: "#8B5CF6",
    Entertainment: "#EC4899",
    Bills: "#F59E0B",
    Health: "#10B981",
    Education: "#6366F1",
    Other: "#6B7280",
    Salary: "#22C55E",
    Freelance: "#06B6D4",
    Investment: "#8B5CF6",
    Gift: "#F472B6",
  };
  return colors[category] || "#6B7280";
};

export const getCategoryColors = (categories: string[]): string[] => {
  return categories.map((cat) => getCategoryColor(cat));
};
