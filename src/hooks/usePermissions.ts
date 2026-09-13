// src/hooks/usePermissions.ts
import { useApp } from "../state/AppState";

export const usePermissions = () => {
  const { state } = useApp();
  const { role } = state;

  return {
    canAdd: role === "admin",
    canEdit: role === "admin",
    canDelete: role === "admin",
    canExport: true, // Both roles can export
    isAdmin: role === "admin",
    isViewer: role === "viewer",
  };
};
