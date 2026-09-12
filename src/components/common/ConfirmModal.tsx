// src/components/common/ConfirmModal.tsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning" | "primary";
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}) => {
  const buttonColors = {
    danger: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    primary: "bg-primary-500 hover:bg-primary-600",
  };

  const iconColors = {
    danger: "text-red-500 bg-red-50 dark:bg-red-900/20",
    warning: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
    primary: "text-primary-500 bg-primary-50 dark:bg-primary-900/20",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-premium max-w-sm w-full p-6">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${iconColors[variant]}`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {message}
                  </p>
                </div>
                <button
                  onClick={onCancel}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={onCancel} className="flex-1 btn-secondary">
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 ${buttonColors[variant]}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
