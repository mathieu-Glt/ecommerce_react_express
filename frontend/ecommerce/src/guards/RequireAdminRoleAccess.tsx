import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import React from "react";
import PageLoader from "../components/LoaderPage/PageLoader";

interface RequireAdminRoleAccessProps {
  children: React.ReactNode;
}

export const RequireAdminRoleAccess: React.FC<RequireAdminRoleAccessProps> = ({
  children,
}) => {
  const { user, isAuthenticated, loading } = useUserContext();
  console.log("RequireAdminRoleAccess - user:", user.role);

  console.log("🔍 GUARD DEBUG:");
  console.log("  - loading:", loading);
  console.log("  - isAuthenticated:", isAuthenticated);
  console.log("  - user:", user);
  console.log("  - user?.role:", user?.role);

  // Attente pendant le chargement
  if (loading) {
    return <PageLoader />;
  }

  // Pas connecté → Redirige vers login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  // Pas admin → Redirige vers accueil
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
