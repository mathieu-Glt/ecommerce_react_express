// src/guards/RequireAdminRoleAccess.tsx
import React from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";

interface RequireAdminRoleAccessProps {
  children: ReactNode;
}

export const RequireAdminRoleAccess: React.FC<RequireAdminRoleAccessProps> = ({
  children,
}) => {
  // Utilise ton contexte
  const { user, isAuthenticated } = useUserContext();

  // Pas connecté → Redirige vers login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  // Pas admin → Redirige vers accueil
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin confirmé  -> Affiche les enfants
  return <>{children}</>;
};
