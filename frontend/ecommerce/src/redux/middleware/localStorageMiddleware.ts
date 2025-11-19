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
 * @example
 * // Dans store.ts
 * middleware: (getDefaultMiddleware) =>
 *   getDefaultMiddleware().concat(localStorageMiddleware)
 */
export const localStorageMiddleware: Middleware<{}, RootState> =
  (storeAPI) => (next) => (action) => {
    // Exécuter l'action Redux normalement d'abord
    const result = next(action);

    // Vérifier si on est dans un environnement navigateur (pas SSR)
    if (typeof window === "undefined") {
      return result;
    }

    try {
      const state = storeAPI.getState();
      const { user, token, refreshToken, isAuthenticated } = state.auth;

      // ============================================
      // 1. SYNCHRONISATION : Sauvegarder dans localStorage
      // ============================================

      const shouldSync = SYNC_ACTIONS.some((type) =>
        action.type.startsWith(type)
      );

      if (shouldSync && isAuthenticated) {
        // Sauvegarder l'utilisateur
        if (user) {
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        }

        // Sauvegarder le token
        if (token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        }

        // Sauvegarder le refresh token
        if (refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }
      }

      // ============================================
      // 2. NETTOYAGE : Supprimer du localStorage
      // ============================================

      const shouldClear =
        CLEAR_ACTIONS.some((type) => action.type === type) || !isAuthenticated;

      if (shouldClear && action.type !== "auth/fetchCurrentUser/pending") {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      }
    } catch (error) {
      // ============================================
      // GESTION D'ERREURS
      // ============================================

      if (error instanceof DOMException) {
        if (error.name === "QuotaExceededError") {
          // Stratégie : nettoyer tout localStorage
          try {
            localStorage.clear();
          } catch (clearError) {
            throw new Error(
              "❌ [localStorage] Quota exceeded and failed to clear storage"
            );
          }
        } else if (error.name === "SecurityError") {
          throw new Error(
            "❌ [localStorage] Security error accessing localStorage"
          );
        }
      }

      // En cas d'erreur critique, nettoyer pour éviter états corrompus
      try {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      } catch (cleanupError) {
        throw new Error("❌ [localStorage] Error during cleanup after failure");
      }
    }

    return result;
  };

/**
 * Fonction utilitaire pour charger l'état initial depuis localStorage
 * À utiliser lors de la création du store pour hydrater l'état initial
 *
 * @returns État d'authentification ou null si pas de données
 *
 * @example
 * const persistedAuth = loadAuthStateFromLocalStorage();
 * const initialState = persistedAuth || defaultInitialState;
 */
export const loadAuthStateFromLocalStorage = () => {
  // Check SSR (Server-Side Rendering)
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const userString = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    // Vérifier que les données minimales sont présentes
    if (!userString || !token) {
      return null;
    }

    // Parser l'utilisateur
    const user = JSON.parse(userString);

    // Validation basique
    if (!user || typeof user !== "object" || !user._id) {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
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
  } catch (error) {
    // Nettoyer les données corrompues
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (cleanupError) {
      throw new Error(
        "❌ [localStorage] Error during cleanup after load failure"
      );
    }

    return null;
  }
};

/**
 * Fonction utilitaire pour nettoyer manuellement le localStorage
 * Utile pour les tests ou le débogage
 *
 * @example
 * clearAuthFromLocalStorage(); // Nettoie user, token, refreshToken
 */
export const clearAuthFromLocalStorage = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    throw new Error("❌ [localStorage] Error clearing auth data");
  }
};

/**
 * Fonction utilitaire pour vérifier si l'utilisateur est authentifié
 * en se basant uniquement sur localStorage (sans Redux)
 *
 * @returns true si token et user présents, false sinon
 *
 * @example
 * if (isAuthenticatedInLocalStorage()) {
 *   // Utilisateur authentifié
 * }
 */
export const isAuthenticatedInLocalStorage = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!(user && token);
  } catch (error) {
    throw new Error("❌ [localStorage] Error checking authentication status");
  }
};

/**
 * Export des constantes pour utilisation externe
 */
export { STORAGE_KEYS };
