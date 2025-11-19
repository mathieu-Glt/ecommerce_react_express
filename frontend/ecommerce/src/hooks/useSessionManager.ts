import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
// import { useUser } from "../contexts/userContext";

const SESSION_CHECK_INTERVAL = 30000; // 30 secondes
const SESSION_WARNING_TIME = 60000; // 1 minute avant expiration

interface User {
  // Définir les propriétés de l'utilisateur selon votre modèle
  [key: string]: any;
}

interface SessionManagerReturn {
  sessionExpired: boolean;
  showWarning: boolean;
  timeUntilExpiry: number;
  refreshSession: () => void;
  forceLogout: () => void;
  updateActivity: () => void;
}

function useSessionManager(): SessionManagerReturn {
  const [sessionExpired, setSessionExpired] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number>(0);
  // const { user, logout } = useUser();
  const [token] = useLocalStorage<string | null>("token", null);

  // Vérifier l'état de la session
  const checkSessionStatus = useCallback((): void => {
    const sessionUser = sessionStorage.getItem("user");
    const sessionToken = sessionStorage.getItem("token");
    const lastActivity = sessionStorage.getItem("lastActivity");

    const now = Date.now();
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const timeSinceLastActivity = lastActivity
      ? now - parseInt(lastActivity)
      : 0;

    // Ne pas afficher la popup si l'utilisateur vient de se connecter
    // Si pas de session mais qu'on a un user/token, synchroniser automatiquement
    if ((!sessionUser || !sessionToken) && (user || token)) {
      // Synchroniser automatiquement au lieu d'afficher la popup
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token || "");
      sessionStorage.setItem("lastActivity", Date.now().toString());
      setShowWarning(false);
      setSessionExpired(false);
      return;
    }

    // Si la session a expiré
    if (lastActivity && timeSinceLastActivity > sessionTimeout) {
      setSessionExpired(true);
      setShowWarning(true);
      return;
    }

    // Si la session va expirer bientôt (dans les 30 secondes pour le test)
    if (lastActivity && timeSinceLastActivity > sessionTimeout - 30000) {
      setShowWarning(true);
      setTimeUntilExpiry(
        Math.max(0, Math.floor((sessionTimeout - timeSinceLastActivity) / 1000))
      );
    } else {
      setShowWarning(false);
      setSessionExpired(false);
    }
  }, [user, token]);

  // Mettre à jour l'activité utilisateur
  const updateActivity = useCallback((): void => {
    if (user || token) {
      sessionStorage.setItem("lastActivity", Date.now().toString());
      // Ne pas fermer automatiquement la popup avec l'activité
      // setSessionExpired(false);
      // setShowWarning(false);
    }
  }, [user, token]);

  // Rafraîchir la session
  const refreshSession = useCallback((): void => {
    // Utiliser les valeurs actuelles de sessionStorage ou localStorage
    const currentUser: User | null =
      user || JSON.parse(sessionStorage.getItem("user") || "null");
    const currentToken: string | null =
      token || sessionStorage.getItem("token");

    if (currentUser && currentToken) {
      // Synchroniser sessionStorage avec localStorage
      sessionStorage.setItem("user", JSON.stringify(currentUser));
      sessionStorage.setItem("token", currentToken);
      sessionStorage.setItem("lastActivity", Date.now().toString());

      // S'assurer que localStorage est à jour
      localStorage.setItem("user", JSON.stringify(currentUser));
      localStorage.setItem("token", currentToken);

      // Réinitialiser les états
      setSessionExpired(false);
      setShowWarning(false);
    } else {
      // Si pas de données valides, déconnecter directement
      try {
        sessionStorage.clear();
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("lastActivity");
        setSessionExpired(false);
        setShowWarning(false);
        logout();
        window.location.href = "/login";
      } catch (error) {
        console.error(
          "useSessionManager - Erreur lors de la déconnexion:",
          error
        );
      }
    }
  }, [user, token, logout]);

  // Déconnecter l'utilisateur
  const forceLogout = useCallback((): void => {
    try {
      // Supprimer sessionStorage
      sessionStorage.clear();

      // Supprimer localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("lastActivity");

      // Réinitialiser les états
      setSessionExpired(false);
      setShowWarning(false);

      // Appeler la fonction de déconnexion du contexte
      logout();

      // Rediriger vers login
      window.location.href = "/login";
    } catch (error) {
      console.error(
        "useSessionManager - Erreur lors de la déconnexion:",
        error
      );
    }
  }, [logout]);

  // Écouter les événements d'activité utilisateur
  useEffect(() => {
    const handleUserActivity = (event: Event): void => {
      const modal = document.querySelector(".modal.show");
      if (modal && modal.contains(event.target as Node)) {
        return;
      }
      updateActivity();
    };

    // DÉSACTIVER complètement les événements d'activité quand la modale est affichée
    if (showWarning) {
      return;
    }

    // Événements moins sensibles pour éviter de fermer la popup par accident
    const events: Array<keyof DocumentEventMap> = [
      "click", // Clics explicites
      "keypress", // Frappe clavier
      "scroll", // Défilement
    ];

    events.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [updateActivity, showWarning]); // Ajouter showWarning comme dépendance

  // Vérifier la session régulièrement
  useEffect(() => {
    const interval = setInterval(() => {
      checkSessionStatus();
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [checkSessionStatus]);

  // Vérifier au chargement
  useEffect(() => {
    checkSessionStatus();
  }, [checkSessionStatus]);

  // Mettre à jour l'activité quand l'utilisateur se connecte
  useEffect(() => {
    if (user && token) {
      updateActivity();
    }
  }, [user, token, updateActivity]);

  return {
    sessionExpired,
    showWarning,
    timeUntilExpiry,
    refreshSession,
    forceLogout,
    updateActivity,
  };
}

export default useSessionManager;
