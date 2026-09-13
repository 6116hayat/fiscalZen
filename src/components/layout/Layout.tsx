// src/components/layout/Layout.tsx
import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  TrendingUp,
  Settings,
  Sun,
  Moon,
  User,
  Shield,
  Eye,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { useApp } from "../../state/AppState";
import { useTheme } from "../../context/ThemeContext";

export const Layout: React.FC = () => {
  const { state, dispatch } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // greet according to the time
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return "Good morning";
    }

    if (hour < 18) {
      return "Good afternoon";
    }

    return "Good evening";
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/transactions", label: "Transactions", icon: Receipt },
    { path: "/insights", label: "Insights", icon: TrendingUp },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.aside
        className={`bg-white dark:bg-gray-800 shadow-lg fixed lg:relative z-40 h-full transition-all duration-300 ease-in-out ${
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        } overflow-hidden`}
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              {sidebarOpen && (
                <span className="text-lg font-bold text-gray-800 dark:text-white">
                  Fiscal-Zen
                </span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:block hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? "" : "rotate-180"}`}
              />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }
                `}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              {sidebarOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {state.role === "admin" ? "Admin User" : "Viewer User"}
                  </p>
                  {/* ROLE ICON: Shield for Admin, Eye for Viewer */}
                  <div className="flex items-center space-x-1">
                    {state.role === "admin" ? (
                      <Shield className="w-3 h-3 text-primary-500" />
                    ) : (
                      <Eye className="w-3 h-3 text-blue-500" />
                    )}

                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {state.role}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              {getGreeting()}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* ROLE SELECTOR: shows Shield for Admin and Eye for Viewer */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-xl">
              {state.role === "admin" ? (
                <Shield className="w-3 h-3 text-primary-500" />
              ) : (
                <Eye className="w-3 h-3 text-blue-500" />
              )}

              <select
                value={state.role}
                onChange={(e) =>
                  dispatch({
                    type: "SET_ROLE",
                    payload: e.target.value as "viewer" | "admin",
                  })
                }
                className="bg-transparent text-sm font-medium text-gray-700 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="viewer">Viewer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Date */}
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
