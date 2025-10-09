import React, { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import type {
  UserContextType,
  UserProviderProps,
} from "../interfaces/userContext.interface";
const DEBUG_AUTH = true;
/**
 * User Context - provides authentication state to the entire app
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider Component
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
  // Get all auth state and methods from useAuth hook
  const authContextValue = useAuth();

  useEffect(() => {
    if (DEBUG_AUTH) {
      console.group("🔐 UserContext Auth State");
      console.log("👤 User:", authContextValue.user);
      console.log("🔑 Token:", authContextValue.token);
      console.log("♻️ Refresh Token:", authContextValue.refreshToken);
      console.log("✅ Authenticated:", authContextValue.isAuthenticated);
      console.groupEnd();
    }
  }, [
    authContextValue.user,
    authContextValue.token,
    authContextValue.refreshToken,
  ]);

  return (
    <UserContext.Provider value={authContextValue}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to access User Context
 *
 * Must be used within a UserProvider component.
 * Provides access to all authentication state and methods.
 *
 * @throws Error if used outside of UserProvider
 *
 * @returns {UserContextType} Authentication state and methods
 *
 * @example
 * // In any component
 * const { user, token, refreshToken, isAuthenticated, login, logout } = useUserContext();
 *
 * console.log("👤 User:", user);
 * console.log("🔑 Token:", token);
 * console.log("♻️ Refresh Token:", refreshToken);
 * console.log("✅ Authenticated:", isAuthenticated);
 *
 * // Login
 * await login("user@example.com", "password123");
 *
 * // Logout
 * await logout();
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
 * (e.g., using with Context.Consumer)
 */
export { UserContext };

/**
 * Type export for use in other files
 */
export type { UserContextType };
