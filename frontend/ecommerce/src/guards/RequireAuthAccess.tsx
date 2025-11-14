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

  console.log("🔐 RequireAuthAccess Guard:");
  console.log("  - loading:", loading);
  console.log("  - isAuthenticated:", isAuthenticated);
  console.log("  - user:", user);
  console.log("  - location:", location.pathname);

  // 1️⃣ Attente pendant le chargement
  if (loading) {
    return <PageLoader />;
  }

  // 2️⃣ Pas authentifié → Redirige vers login
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

  // 3️⃣ Admin essaie d'accéder à une page utilisateur → Redirige vers dashboard admin
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

  // 4️⃣ ✅ Utilisateur normal connecté → Affiche le contenu
  return <>{children}</>;
};
