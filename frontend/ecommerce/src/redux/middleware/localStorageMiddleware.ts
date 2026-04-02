import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

/**
 * Liste des clés localStorage gérées par le middleware
 */
const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
} as const;

/**
 * Actions qui déclenchent la sauvegarde dans localStorage
 */
const SYNC_ACTIONS = [
  "auth/loginUser/fulfilled",
  "auth/registerUser/fulfilled",
  "auth/fetchCurrentUser/fulfilled",
  "auth/setUser",
  "auth/setTokens",
] as const;

/**
 * Actions qui déclenchent le nettoyage du localStorage
 */
const CLEAR_ACTIONS = [
  "auth/clearAuthState",
  "auth/logout",
  "auth/loginUser/rejected",
  "auth/fetchCurrentUser/rejected",
] as const;

/**
 * Middleware Redux pour synchroniser automatiquement
 * l'état d'authentification avec localStorage
 *
 * @description
 * Ce middleware intercepte les actions Redux et:
 * 1. Sauvegarde automatiquement user/token dans localStorage après certaines actions
 * 2. Nettoie localStorage après déconnexion ou erreurs
 * 3. Gère les erreurs localStorage (quota, parsing, etc.)
 * 4. Centralise toute la logique localStorage en un seul endroit
 *
 * Note:
 * - L'action est typée comme `unknown` pour respecter TypeScript strict
 * - On vérifie sa forme avant d'accéder à `action.type`
 *
 * @example
 * middleware: (getDefaultMiddleware) =>
 *   getDefaultMiddleware().concat(localStorageMiddleware)
 */
export const localStorageMiddleware: Middleware<{}, RootState> =
  (storeAPI) => (next) => (action: unknown) => {
    // On exécute l'action Redux normalement d'abord
    const result = next(action);

    // On s'assure d'être dans un environnement navigateur
    if (typeof window === "undefined") return result;

    try {
      const state = storeAPI.getState();
      const { user, token, refreshToken, isAuthenticated } = state.auth;

      // Vérifier que l'action est un objet avec un type
      const actionType =
        typeof action === "object" &&
        action !== null &&
        "type" in action &&
        typeof (action as { type: string }).type === "string"
          ? (action as { type: string }).type
          : "";

      // SYNCHRONISATION : Sauvegarder dans localStorage
      const shouldSync = SYNC_ACTIONS.some((type) =>
        actionType.startsWith(type),
      );
      if (shouldSync && isAuthenticated) {
        if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        if (refreshToken)
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }

      // NETTOYAGE : Supprimer du localStorage
      const shouldClear =
        CLEAR_ACTIONS.some((type) => actionType === type) || !isAuthenticated;
      if (shouldClear && actionType !== "auth/fetchCurrentUser/pending") {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    } catch (error) {
      // Gestion d'erreurs localStorage
      
      if (error instanceof DOMException) {
        if (error.name === "QuotaExceededError") {
          try {
            localStorage.clear();
          } catch {
            throw new Error(
              "❌ [localStorage] Quota exceeded and failed to clear storage",
            );
          }
        } else if (error.name === "SecurityError") {
          throw new Error(
            "❌ [localStorage] Security error accessing localStorage",
          );
        }
      }

      // Nettoyage préventif en cas d'erreur critique
      try {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      } catch {
        throw new Error("❌ [localStorage] Error during cleanup after failure");
      }
    }

    return result;
  };

/**
 * Charger l'état initial depuis localStorage
 * à utiliser pour hydrater l'état Redux au démarrage
 */
export const loadAuthStateFromLocalStorage = () => {
  if (typeof window === "undefined") return null;

  try {
    const userString = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    if (!userString || !token) return null;

    const user = JSON.parse(userString);
    if (!user || typeof user !== "object" || !("_id" in user)) {
      clearAuthFromLocalStorage();
      return null;
    }

    return {
      user,
      token,
      refreshToken,
      isAuthenticated: true,
      loading: false,
      error: null,
    };
  } catch {
    clearAuthFromLocalStorage();
    return null;
  }
};

/**
 * Nettoyer manuellement le localStorage
 */
export const clearAuthFromLocalStorage = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch {
    throw new Error("❌ [localStorage] Error clearing auth data");
  }
};

/**
 * Vérifier si l'utilisateur est authentifié en localStorage
 */
export const isAuthenticatedInLocalStorage = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!(user && token);
  } catch {
    return false;
  }
};

/**
 * Export des constantes pour utilisation externe
 */
export { STORAGE_KEYS };
