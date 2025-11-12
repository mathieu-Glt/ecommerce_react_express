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
  const location = useLocation(); //Récupère l'URL actuelle
  if (loading) {
    return <PageLoader />;
  }

  // Pas authentifié → Redirige vers login
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname, // url actuelle ou lutilisateur souhaite se rendre
          message: "Please log in to access this page",
        }}
      />
    );
  } else if (isAuthenticated && user.role === "admin") {
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
  } else {
    // return <Navigate to={location.pathname} replace />
    // location.pathname est la page actuelle, donc on reste sur la même page;
    return <Navigate to="/products" replace />;
  }

  // Utilisateur connecté  → Affiche les enfants
  // return <>{children}</>;
};
