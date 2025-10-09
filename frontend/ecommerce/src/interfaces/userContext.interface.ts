import type { User } from "./user.interface";
import type { ReactNode } from "react";

/**
 * Type definition for the User Context
 * Contains all authentication state and methods from useAuth
 */
export interface UserContextType {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Methods
  login: (email: string, password: string) => Promise<boolean>;
  register: (credentials: any) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => boolean;
  refreshAuth: () => Promise<boolean>;
  clearLocalStorage: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
}

/**
 * Props for UserProvider component
 */
export interface UserProviderProps {
  children: ReactNode;
}
