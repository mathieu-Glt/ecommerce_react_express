// src/layouts/AdminLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { RequireAdminRoleAccess } from "../../guards/RequireAdminRoleAccess";

export const AdminLayout = () => {
  return (
    <RequireAdminRoleAccess>
      {/* Outlet affiche les routes enfants */}
      <Outlet />
    </RequireAdminRoleAccess>
  );
};
