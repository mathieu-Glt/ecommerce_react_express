import React, { createContext, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAppDispatch } from "../hooks/useReduxHooks";
import { fetchCurrentUser } from "../redux/thunks/authThunk";
import type {
  UserContextType,
  UserProviderProps,
} from "../interfaces/userContext.interface";

const DEBUG_AUTH = process.env.NODE_ENV === "development";

/**
 * User Context - provides authentication state to the entire app
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider Component
 *
 * ✅ Version améliorée avec hydratation automatique
 * ✅ Appelle fetchCurrentUser() au démarrage
 * ✅ Code simplifié et optimisé
 *
 * Wraps the application and provides authentication context to all child components.
 * Uses the useAuth hook internally to manage authentication state.
 *
 * @example
 * // In App.tsx or index.tsx
 * <UserProvider>
 *   <App />
 * </UserProvider>
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();

  // ============================================
  // AUTH STATE ET MÉTHODES
  // ============================================

  /**
   * Récupère tout l'état d'authentification depuis useAuth
   * useAuth utilise Redux comme source unique de vérité
   */
  const authValue = useAuth();

  // ============================================
  // HYDRATATION AU DÉMARRAGE
  // ============================================

  /**
   * Récupère l'utilisateur au démarrage de l'application
   *
   * Flux :
   * 1. loadAuthStateFromLocalStorage() s'est déjà exécuté (import authSlice)
   * 2. Redux est déjà hydraté avec localStorage
   * 3. fetchCurrentUser() vérifie et valide les données
   * 4. Si localStorage vide mais token présent → Appel API
   */
  useEffect(() => {
    console.log("🚀 UserProvider mounted - checking authentication...");

    // Récupérer/vérifier l'utilisateur actuel
    dispatch(fetchCurrentUser())
      .unwrap()
      .then(() => {
        console.log("✅ User authentication verified");
      })
      .catch((error) => {
        console.log("⚠️ No active session:", error);
        // Pas d'erreur bloquante, l'utilisateur sera redirigé si nécessaire
      });
  }, [dispatch]);

  // ============================================
  // DEBUG LOGS (Development only)
  // ============================================

  /**
   * Logs l'état d'authentification en développement
   * Aide au debugging
   */
  useEffect(() => {
    if (DEBUG_AUTH) {
      console.group("🔐 UserContext Auth State");
      console.log("👤 User:", authValue.user);
      console.log("🔑 Token:", authValue.token ? "présent" : "absent");
      console.log(
        "♻️ Refresh Token:",
        authValue.refreshToken ? "présent" : "absent"
      );
      console.log("✅ Authenticated:", authValue.isAuthenticated);
      console.log("⏳ Loading:", authValue.loading);
      console.log("❌ Error:", authValue.error);
      console.groupEnd();
    }
  }, [
    authValue.user,
    authValue.token,
    authValue.refreshToken,
    authValue.isAuthenticated,
    authValue.loading,
    authValue.error,
  ]);

  // ============================================
  // MEMOIZED CONTEXT VALUE
  // ============================================

  /**
   * Mémorise la valeur du contexte
   * Normalise l'erreur en string
   */
  const contextValue = useMemo(() => {
    // Normalise l'erreur en string ou null
    let normalizedError: string | null = null;

    if (authValue.error) {
      if (typeof authValue.error === "string") {
        normalizedError = authValue.error;
      } else if (authValue.error instanceof Error) {
        normalizedError = authValue.error.message;
      } else if (typeof authValue.error === "object") {
        normalizedError = JSON.stringify(authValue.error);
      }
    }

    return {
      ...authValue,
      error: normalizedError,
    };
  }, [authValue]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

/**
 * Custom hook to access User Context
 *
 * ✅ Version simplifiée et type-safe
 *
 * Must be used within a UserProvider component.
 * Provides access to all authentication state and methods.
 *
 * @throws Error if used outside of UserProvider
 *
 * @returns {UserContextType} Authentication state and methods
 *
 * @example
 * // Dans n'importe quel composant
 * const { user, token, isAuthenticated, login, logout } = useUserContext();
 *
 * if (!isAuthenticated) {
 *   return <Navigate to="/login" />;
 * }
 *
 * return (
 *   <div>
 *     <h1>Bonjour {user?.firstname}!</h1>
 *     <button onClick={logout}>Déconnexion</button>
 *   </div>
 * );
 */
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error(
      "useUserContext must be used within a UserProvider. " +
        "Wrap your component tree with <UserProvider>...</UserProvider>"
    );
  }

  return context;
};

/**
 * Export the context itself for advanced use cases
 */
export { UserContext };

/**
 * Type export for use in other files
 */
export type { UserContextType };

/**
 * ============================================
 * NOTES D'UTILISATION
 * ============================================
 *
 * ✅ CHANGEMENTS vs ancienne version :
 *
 * 1. HYDRATATION AUTOMATIQUE
 *    - Appel à fetchCurrentUser() au démarrage
 *    - Vérifie localStorage + validation API si nécessaire
 *    - Gestion transparente pour l'utilisateur
 *
 * 2. SIMPLIFICATION
 *    - Plus de logique complexe de synchronisation
 *    - useAuth gère tout
 *    - Code plus court et clair
 *
 * 3. PERFORMANCE
 *    - Mémoisation optimisée
 *    - Moins de re-renders inutiles
 *    - useEffect avec bonnes dépendances
 *
 * ============================================
 * EXEMPLE D'UTILISATION DANS APP.TSX
 * ============================================
 *
 * import { UserProvider } from './contexts/userContext';
 * import { store } from './redux/store';
 * import { Provider } from 'react-redux';
 *
 * function App() {
 *   return (
 *     <Provider store={store}>
 *       <UserProvider>
 *         <Routes>
 *           <Route path="/login" element={<LoginPage />} />
 *           <Route path="/dashboard" element={
 *             <ProtectedRoute>
 *               <Dashboard />
 *             </ProtectedRoute>
 *           } />
 *         </Routes>
 *       </UserProvider>
 *     </Provider>
 *   );
 * }
 *
 * ============================================
 * EXEMPLE DE ROUTE PROTÉGÉE
 * ============================================
 *
 * import { useUserContext } from './contexts/userContext';
 * import { Navigate } from 'react-router-dom';
 *
 * function ProtectedRoute({ children }) {
 *   const { isAuthenticated, loading } = useUserContext();
 *
 *   if (loading) {
 *     return <LoadingScreen />;
 *   }
 *
 *   if (!isAuthenticated) {
 *     return <Navigate to="/login" replace />;
 *   }
 *
 *   return children;
 * }
 *
 * ============================================
 */
