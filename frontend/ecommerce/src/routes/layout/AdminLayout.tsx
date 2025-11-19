// src/layouts/AdminLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { RequireAdminRoleAccess } from "../../guards/RequireAdminRoleAccess";
import { AdminHeader } from "../../components/backoffice/AdminHeader/AdminHeader";

export const AdminLayout = () => {
  return (
    <div className="main-layout">
      {/* Header at the top */}
      <AdminHeader />

      {/* Outlet displays the child routes */}
      {/* Dynamic content (pages) */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};
