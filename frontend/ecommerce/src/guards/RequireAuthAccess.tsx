import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import React from "react";
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
  const { user, isAuthenticated } = useUserContext();
  const location = useLocation(); //Récupère l'URL actuelle

  // Pas authentifié → Redirige vers login
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

  // Utilisateur connecté  → Affiche les enfants
  return <>{children}</>;
};
