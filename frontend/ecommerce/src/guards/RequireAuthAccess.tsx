import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import React from "react";
import PageLoader from "../components/LoaderPage/PageLoader";

interface RequireAuthAccessProps {
  children: ReactNode;
}

/**
 * Guard de protection pour routes nécessitant une authentification
 * Vérifie uniquement si l'utilisateur est connecté (pas le rôle)
 */
export const RequireAuthAccess: React.FC<RequireAuthAccessProps> = ({
  children,
}) => {
  const { user, isAuthenticated, loading } = useUserContext();
  const location = useLocation();

  // Wait loading state
  if (loading) {
    return <PageLoader />;
  }

  // Not authenticated → Redirect to login
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: "Please log in to access this page",
        }}
      />
    );
  }

  // Admin tries to access a user page → Redirect to admin dashboard
  if (user.role === "admin") {
    return (
      <Navigate
        to="/admin/dashboard"
        replace
        state={{
          from: location.pathname,
          message: "Admins cannot access user pages",
        }}
      />
    );
  }

  // Normal user authenticated → Show content
  return <>{children}</>;
};
