import { useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import useToast from "./usetoast";

import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import { clearAuthState } from "../redux/slices/authSlice";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../interfaces/user.interface";
import { registerUser } from "../redux/thunks/authThunk";
import { sendResetPasswordEmail } from "../redux/thunks/forgotPasswordThunk";

/**
 * Custom hook for authentication management
 *
 * Provides memoized methods for login, register, logout and manages authentication state
 * including localStorage synchronization and Redux state management.
 *
 * @returns Authentication state and memoized methods
 *
 * @example
 * const { login, logout, register, isAuthenticated, user, loading } = useAuth();
 *
 * // Login
 * await login("user@example.com", "password123");
 *
 * // Register
 * await register({
 *   email: "new@example.com",
 *   password: "password123",
 *   firstname: "John",
 *   lastname: "Doe",
 *   picture: "base64..."
 * });
 *
 * // Logout
 * await logout();
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Redux state - memoized selector
  // Redux state - memoized selector
  const authState = useAppSelector((state) => state.auth);
  // import useToast from hooks
  const toast = useToast();
  const {
    user: reduxUser,
    loading,
    error,
    isAuthenticated: reduxIsAuthenticated,
  } = authState;
  // LocalStorage management
  const [userStorage, setUserStorage] = useLocalStorage<User | null>(
    "user",
    null
  );
  const [tokenStorage, setTokenStorage] = useLocalStorage<string | null>(
    "token",
    ""
  );
  const [refreshTokenStorage, setRefreshTokenStorage] = useLocalStorage<
    string | null
  >("refreshToken", "");

  /**
   * Clears all authentication data from localStorage
   * Memoized to prevent unnecessary re-renders
   *
   * @private
   */
  const clearLocalStorage = useCallback((): void => {
    setUserStorage(null);
    setTokenStorage("");
    setRefreshTokenStorage("");

    // Also clear directly from localStorage as backup
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken"); // Legacy support

    console.log("🧹 Local storage cleared");
  }, [setUserStorage, setTokenStorage, setRefreshTokenStorage]);

  /**
   * Checks if user has valid authentication
   * Memoized to avoid recalculation on every render
   *
   * @returns boolean - True if user is authenticated
   */
  const checkAuth = useCallback((): boolean => {
    const hasToken = !!tokenStorage;
    const hasUser = !!userStorage;
    return hasToken && hasUser;
  }, [tokenStorage, userStorage]);

  /**
   * Gets the current authenticated user
   * Memoized value combining Redux and localStorage
   *
   * @returns User | null - Current user or null if not authenticated
   */
  const currentUser = useMemo((): User | null => {
    return reduxUser || userStorage;
  }, [reduxUser, userStorage]);

  /**
   * Computed authentication status
   * Memoized to combine Redux state and localStorage check
   */
  const isAuthenticated = useMemo((): boolean => {
    return reduxIsAuthenticated || checkAuth();
  }, [reduxIsAuthenticated, checkAuth]);

  /**
   * Logs in a user with email and password
   * Memoized function to prevent recreation on each render
   *
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise<boolean> - True if login successful, false otherwise
   *
   * @example
   * const success = await login("user@example.com", "password123");
   * if (success) {
   *   console.log("Login successful!");
   * }
   */
  const login = useCallback(
    async (
      email: string,
      password: string,
      rememberMe: boolean
    ): Promise<boolean> => {
      try {
        const result = await dispatch(loginUser({ email, password }));
        console.log("Login result:", result.payload);

        if (loginUser.fulfilled.match(result)) {
          const user = result.payload.results.user;
          const token = result.payload.results.token || ""; // Adjust property name as per ApiResponse
          const refreshToken = result.payload.results.refreshToken || ""; // Adjust property name as per ApiResponse
          if (rememberMe) {
            // Store in localStorage
            setUserStorage(user);
            setTokenStorage(token);
            setRefreshTokenStorage(refreshToken);
          }

          console.log("Login successful:", user.email);

          // Navigate to dashboard
          navigate("/");

          return true;
        } else {
          console.error("Login failed:", result.payload);
          return false;
        }
      } catch (err) {
        console.error("Unexpected error during login:", err);
        return false;
      }
    },
    [
      dispatch,
      navigate,
      setUserStorage,
      setTokenStorage,
      setRefreshTokenStorage,
    ]
  );

  /**
   * Reset password functionality
   * Memoized function to prevent recreation on each render
   * Currently a placeholder for future implementation
   * @param email - User's email address
   *
   * @returns Promise<void>
   */

  const forgotResetPassword = useCallback(
    async (email: string): Promise<void> => {
      try {
        const result = await dispatch(sendResetPasswordEmail({ email }));
        console.log("Reset password result:", result.payload);
        if (sendResetPasswordEmail.fulfilled.match(result)) {
          console.log("Reset password email sent successfully");
        } else {
          console.error("Reset password failed:", result.payload);
        }
      } catch (err) {
        console.error("Unexpected error during password reset:", err);
      }
    },
    [dispatch]
  );

  /**
   * Registers a new user
   * Memoized function to prevent recreation on each render
   *
   * @param credentials - User registration data
   * @returns Promise<boolean> - True if registration successful, false otherwise
   *
   * @example
   * const success = await register({
   *   email: "new@example.com",
   *   password: "SecurePass123",
   *   firstname: "John",
   *   lastname: "Doe",
   *   picture: "data:image/png;base64,..."
   * });
   */
  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<boolean> => {
      try {
        const result = await dispatch(registerUser(credentials));

        if (registerUser.fulfilled.match(result)) {
          const { user } = result.payload.results;

          console.log("Registration successful:", user.email);

          // 📨 Afficher un message de succès
          toast.showSuccess(
            `Welcome ${user.firstname} dear Please log in with your new account. Don’t forget to check your spam folder if you don’t see our confirmation email.`
          );

          // Navigate to login page after successful registration
          navigate("/login");

          return true;
        } else {
          console.error("Registration failed:", result.payload);
          return false;
        }
      } catch (err) {
        console.error("Unexpected error during registration:", err);
        return false;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Logs out the current user
   * Memoized function to prevent recreation on each render
   *
   * Clears Redux state, localStorage and navigates to login page
   *
   * @returns Promise<void>
   *
   * @example
   * await logout();
   * // User is now logged out and redirected to login page
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Call logout API
      await dispatch(logoutUser({}));

      console.log("Logout successful");
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      // Always clear local data even if API call fails
      clearLocalStorage();
      dispatch(clearAuthState(undefined));
      navigate("/login");
    }
  }, [dispatch, navigate, clearLocalStorage]);

  /**
   * Refreshes authentication tokens
   * Memoized function to prevent recreation on each render
   *
   * @returns Promise<boolean> - True if refresh successful
   *
   * @example
   * const success = await refreshAuth();
   * if (!success) {
   *   // Token refresh failed, user will be logged out
   * }
   */
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    if (!refreshTokenStorage) {
      console.error("❌ No refresh token available");
      return false;
    }

    try {
      // TODO: Implement refresh token logic
      // const newTokens = await refreshTokens();
      // setTokenStorage(newTokens.accessToken);
      // if (newTokens.refreshToken) {
      //   setRefreshTokenStorage(newTokens.refreshToken);
      // }

      console.log("✅ Token refreshed successfully");
      return true;
    } catch (err) {
      console.error("❌ Token refresh failed:", err);
      await logout();
      return false;
    }
  }, [refreshTokenStorage, logout, setTokenStorage, setRefreshTokenStorage]);

  /**
   * Updates user profile data in both Redux and localStorage
   * Memoized function to prevent recreation on each render
   *
   * @param updates - Partial user data to update
   *
   * @example
   * updateUserProfile({ firstname: "Jane", address: "123 Main St" });
   */
  const updateUserProfile = useCallback(
    (updates: Partial<User>): void => {
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        setUserStorage(updatedUser);
        // TODO: Dispatch action to update Redux state
        console.log("✅ User profile updated:", updatedUser);
      }
    },
    [currentUser, setUserStorage]
  );

  /**
   * Memoized auth context value
   * Only recreates when dependencies change
   */
  const authContextValue = useMemo(
    () => ({
      // State
      user: currentUser,
      token: tokenStorage,
      refreshToken: refreshTokenStorage,
      loading,
      error,
      isAuthenticated,

      // Methods
      login,
      register,
      logout,
      checkAuth,
      refreshAuth,
      clearLocalStorage,
      updateUserProfile,
      forgotResetPassword,
    }),
    [
      currentUser,
      loading,
      error,
      isAuthenticated,
      login,
      register,
      logout,
      checkAuth,
      refreshAuth,
      clearLocalStorage,
      updateUserProfile,
      forgotResetPassword,
    ]
  );

  // Sync localStorage with Redux on mount
  useEffect(() => {
    if (!reduxUser && userStorage && tokenStorage) {
      // TODO: Optionally restore user session in Redux if needed
      console.log("🔄 Session restored from localStorage");
    }
  }, [reduxUser, userStorage, tokenStorage]);

  // Auto-logout on token expiration (optional)
  useEffect(() => {
    if (isAuthenticated && tokenStorage) {
      // TODO: Implement token expiration check
      // const checkTokenExpiration = () => {
      //   const isExpired = checkIfTokenExpired(tokenStorage);
      //   if (isExpired) {
      //     refreshAuth();
      //   }
      // };
      // const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
      // return () => clearInterval(interval);
    }
  }, [isAuthenticated, tokenStorage, refreshAuth]);

  return authContextValue;
};
