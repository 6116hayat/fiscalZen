// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./state/AppState";
import { ThemeProvider } from "./context/ThemeContext";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { Insights } from "./pages/Insights";
import Settings from "./pages/Settings";
import { ToastProvider } from "./components/common/Toast";

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="insights" element={<Insights />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
