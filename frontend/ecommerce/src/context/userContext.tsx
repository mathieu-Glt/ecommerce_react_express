import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
 */
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const authValue = useAuth();

  // Use useRef to avoid calling fetchCurrentUser multiple times
  const hasInitialized = useRef(false);

  // ============================================
  // HYDRATATION AU DÉMARRAGE
  // ============================================

  useEffect(() => {
    // Execute only once
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    // Récupérer/vérifier l'utilisateur actuel
    dispatch(fetchCurrentUser()).unwrap();
  }, []); // No dependencies - runs only once on mount

  // ============================================
  // DEBUG LOGS (Development only)
  // ============================================
  // No dependencies - runs on every render but does not cause a loop
  // useEffect(() => {
  //   if (DEBUG_AUTH) {
  //     console.group("🔐 UserContext Auth State");
  //     console.log("👤 User:", authValue.user);
  //     console.log("🔑 Token:", authValue.token ? "présent" : "absent");
  //     console.log(
  //       "♻️ Refresh Token:",
  //       authValue.refreshToken ? "présent" : "absent"
  //     );
  //     console.log("✅ Authenticated:", authValue.isAuthenticated);
  //     console.log("⏳ Loading:", authValue.loading);
  //     console.log("❌ Error:", authValue.error);
  //     console.groupEnd();
  //   }
  //   });

  // ============================================
  // MEMOIZED CONTEXT VALUE
  // ============================================

  const contextValue = useMemo(() => {
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

export { UserContext };
export type { UserContextType };
