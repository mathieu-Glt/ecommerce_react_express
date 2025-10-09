import { useState, useEffect, useCallback } from "react";
import useLocalStorage from "./useLocalStorage";
import { useUser } from "../contexts/userContext";

const SESSION_CHECK_INTERVAL = 30000; // 30 secondes
const SESSION_WARNING_TIME = 60000; // 1 minute avant expiration

function useSessionManager() {
  const [sessionExpired, setSessionExpired] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState(0);
  const { user, logout } = useUser();
  const [token] = useLocalStorage("token", null);

  // Vérifier l'état de la session
  const checkSessionStatus = useCallback(() => {
    const sessionUser = sessionStorage.getItem("user");
    const sessionToken = sessionStorage.getItem("token");
    const lastActivity = sessionStorage.getItem("lastActivity");

    const now = Date.now();
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const timeSinceLastActivity = lastActivity
      ? now - parseInt(lastActivity)
      : 0;

    console.log("useSessionManager - checkSessionStatus:");
    console.log("  sessionUser:", sessionUser ? "Présent" : "Absent");
    console.log("  sessionToken:", sessionToken ? "Présent" : "Absent");
    console.log("  lastActivity:", lastActivity);
    console.log("  timeSinceLastActivity:", timeSinceLastActivity, "ms");
    console.log("  sessionTimeout:", sessionTimeout, "ms");
    console.log("  user:", user ? "Présent" : "Absent");
    console.log("  token:", token ? "Présent" : "Absent");

    // Ne pas afficher la popup si l'utilisateur vient de se connecter
    // Si pas de session mais qu'on a un user/token, synchroniser automatiquement
    if ((!sessionUser || !sessionToken) && (user || token)) {
      console.log(
        "useSessionManager - Session manquante, synchronisation automatique"
      );
      // Synchroniser automatiquement au lieu d'afficher la popup
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("lastActivity", Date.now().toString());
      setShowWarning(false);
      setSessionExpired(false);
      return;
    }

    // Si la session a expiré
    if (lastActivity && timeSinceLastActivity > sessionTimeout) {
      console.log("useSessionManager - Session expirée, affichage popup");
      setSessionExpired(true);
      setShowWarning(true);
      return;
    }

    // Si la session va expirer bientôt (dans les 30 secondes pour le test)
    if (lastActivity && timeSinceLastActivity > sessionTimeout - 30000) {
      console.log(
        "useSessionManager - Session va expirer, affichage avertissement"
      );
      setShowWarning(true);
      setTimeUntilExpiry(
        Math.max(0, Math.floor((sessionTimeout - timeSinceLastActivity) / 1000))
      );
    } else {
      console.log("useSessionManager - Session OK, pas de popup");
      setShowWarning(false);
      setSessionExpired(false);
    }
  }, [user, token]);

  // Mettre à jour l'activité utilisateur
  const updateActivity = useCallback(() => {
    if (user || token) {
      sessionStorage.setItem("lastActivity", Date.now().toString());
      // Ne pas fermer automatiquement la popup avec l'activité
      // setSessionExpired(false);
      // setShowWarning(false);
    }
  }, [user, token]);

  // Rafraîchir la session
  const refreshSession = useCallback(() => {
    console.log("useSessionManager - Rafraîchissement de session...");

    // Utiliser les valeurs actuelles de sessionStorage ou localStorage
    const currentUser =
      user || JSON.parse(sessionStorage.getItem("user") || "null");
    const currentToken = token || sessionStorage.getItem("token");

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

      console.log("useSessionManager - Session rafraîchie avec succès");
    } else {
      console.log(
        "useSessionManager - Impossible de rafraîchir la session (user ou token manquant)"
      );
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
  const forceLogout = useCallback(() => {
    console.log("useSessionManager - Déconnexion complète en cours...");

    try {
      // Supprimer sessionStorage
      sessionStorage.clear();
      console.log("useSessionManager - sessionStorage supprimé");

      // Supprimer localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("lastActivity");
      console.log("useSessionManager - localStorage supprimé");

      // Réinitialiser les états
      setSessionExpired(false);
      setShowWarning(false);

      // Appeler la fonction de déconnexion du contexte
      logout();

      // Rediriger vers login
      window.location.href = "/login";

      console.log("useSessionManager - Déconnexion complète terminée");
    } catch (error) {
      console.error(
        "useSessionManager - Erreur lors de la déconnexion:",
        error
      );
    }
  }, [logout]);

  // Écouter les événements d'activité utilisateur
  useEffect(() => {
    const handleUserActivity = (event) => {
      const modal = document.querySelector(".modal.show");
      if (modal && modal.contains(event.target)) {
        console.log(
          "useSessionManager - Clic sur la modale, pas de mise à jour d'activité"
        );
        return;
      }
      updateActivity();
    };

    // DÉSACTIVER complètement les événements d'activité quand la modale est affichée
    if (showWarning) {
      console.log(
        "useSessionManager - Modale affichée, événements d'activité désactivés"
      );
      return;
    }

    // Événements moins sensibles pour éviter de fermer la popup par accident
    const events = [
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
