import type { ChangeEvent } from "react";
import { Search, Filter, X } from "lucide-react";
import { useApp } from "../../state/AppState";
import { ALL_CATEGORIES } from "../../types";

export const TransactionFilters = () => {
  const { state, dispatch } = useApp();
  const { filters } = state;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_FILTERS", payload: { search: e.target.value } });
  };

  const handleTypeFilter = (type: "all" | "INCOME" | "EXPENSE") => {
    dispatch({ type: "SET_FILTERS", payload: { type } });
  };

  const handleCategoryFilter = (category: string) => {
    dispatch({ type: "SET_FILTERS", payload: { category } });
  };

  const clearFilters = () => {
    dispatch({
      type: "SET_FILTERS",
      payload: { search: "", type: "all", category: "all" },
    });
  };

  const hasActiveFilters =
    filters.search || filters.type !== "all" || filters.category !== "all";

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
          />
          {filters.search && (
            <button
              onClick={() =>
                dispatch({ type: "SET_FILTERS", payload: { search: "" } })
              }
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Type Filters */}
        <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
          {(["all", "INCOME", "EXPENSE"] as const).map((type) => (
            <button
              key={type}
              onClick={() => handleTypeFilter(type)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                filters.type === type
                  ? "bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {type === "all"
                ? "All"
                : type === "INCOME"
                  ? "Income"
                  : "Expenses"}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />

        {/* Category Filter Dropdown */}
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => handleCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer pr-8"
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <Filter className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400">
              Search: {filters.search}
              <button
                onClick={() =>
                  dispatch({ type: "SET_FILTERS", payload: { search: "" } })
                }
                className="ml-1 hover:text-primary-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.type !== "all" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Type: {filters.type}
              <button
                onClick={() =>
                  dispatch({ type: "SET_FILTERS", payload: { type: "all" } })
                }
                className="ml-1 hover:text-green-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.category !== "all" && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              Category: {filters.category}
              <button
                onClick={() =>
                  dispatch({
                    type: "SET_FILTERS",
                    payload: { category: "all" },
                  })
                }
                className="ml-1 hover:text-purple-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
