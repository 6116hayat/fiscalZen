// function App() {
//   return (
//     <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
//       <div className="mx-auto max-w-2xl space-y-6">
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//             Finance Dashboard
//           </h1>

//           <p className="mt-2 text-gray-500 dark:text-gray-400">
//             Tailwind CSS v4 is working!
//           </p>
//         </div>

//         {/* Card */}
//         <div className="card p-6">
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Current Balance
//           </p>

//           <h2 className="mt-2 text-4xl font-bold text-primary-600">₹25,450</h2>

//           <div className="mt-4 flex gap-2">
//             <span className="badge badge-income">+₹5,000 Income</span>

//             <span className="badge badge-expense">-₹1,200 Expense</span>
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-3">
//           <button className="btn-primary">Add Transaction</button>

//           <button className="btn-secondary">View Transactions</button>

//           <button className="btn-danger">Delete</button>
//         </div>

//         {/* Input */}
//         <div className="card p-6">
//           <label className="mb-2 block font-medium">Transaction name</label>

//           <input
//             className="input-field"
//             type="text"
//             placeholder="e.g. Grocery"
//           />
//         </div>

//         {/* Animation */}
//         <div className="animate-fade-in rounded-2xl bg-primary-500 p-6 text-white">
//           🎉 Fade-in animation works!
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;

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

function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}

export default App;
