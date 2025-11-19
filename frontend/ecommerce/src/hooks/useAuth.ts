import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "./usetoast";
import { useAppDispatch, useAppSelector } from "./useReduxHooks";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
} from "../interfaces/user.interface";
import {
  loginUser,
  registerUser,
  fetchCurrentUser,
  logoutThunk as logoutUser,
} from "../redux/thunks/authThunk";
import { sendResetPasswordEmail } from "../redux/thunks/forgotPasswordThunk";
import { resetPasswordThunk } from "../redux/thunks/resetPasswordThunk";
import type { DataResetPassword } from "../interfaces/resetPassword";
import type { LoginApiResponse } from "../interfaces/response.interface";

/**
 * Custom hook for authentication management
 *
 * Simplified version with localStorage middleware
 * No need for useLocalStorage anymore (the middleware handles everything)
 * Redux is the single source of truth for auth state
 * Code is simpler and maintainable
 *
 * @returns Authentication state and memoized methods
 *
 * @example
 * const { login, logout, register, isAuthenticated, user, loading } = useAuth();
 *
 * // Login
 * await login("user@example.com", "password123");
 *
 * // Logout
 * await logout();
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  // ============================================
  // REDUX STATE - Single source of truth
  // ============================================

  /**
   * Get the authentication state from Redux
   * The middleware automatically syncs with localStorage
   */
  const { user, loading, error, isAuthenticated, token, refreshToken } =
    useAppSelector((state) => state.auth);

  // ============================================
  // LOGIN
  // ============================================

  /**
   * Connect a user
   * The middleware will automatically save to localStorage
   *
   * @param email - User's email
   * @param password - Password
   * @param rememberMe - If true, saves to localStorage (via middleware)
   * @returns Promise<boolean> - true if successful
   */
  const login = useCallback(
    async (email: string, password: string): Promise<LoginApiResponse> => {
      try {
        const result = await dispatch(loginUser({ email, password })).unwrap();

        // The middleware has already saved to localStorage!
        // No need for setUserStorage(), setTokenStorage(), etc.

        toast.showSuccess(`Welcome back, ${result.results.user.firstname}!`);

        // Navigate to dashboard
        navigate("/");

        return {
          success: true,
          results: {
            user: result.results.user,
            token: result.results.token,
            refreshToken: result.results.refreshToken,
          },
        };
      } catch (err: any) {
        toast.showError(err?.message || "Login failed");
        return err;
      }
    },
    [dispatch, navigate, toast]
  );

  // ============================================
  // REGISTER
  // ============================================

  /**
   * Register a new user
   *
   * @param credentials - Registration data
   * @returns Promise<boolean> - true if successful
   */
  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<boolean> => {
      try {
        const result = await dispatch(registerUser(credentials)).unwrap();

        toast.showSuccess(
          `Welcome ${result.results.user.firstname}! Please check your email to verify your account.`
        );

        // Redirection vers login
        navigate("/login");

        return true;
      } catch (err: any) {
        toast.showError(err?.message || "Registration failed");
        return false;
      }
    },
    [dispatch, navigate, toast]
  );

  // ============================================
  // LOGOUT
  // ============================================

  /**
   * Disconnect the user
   * The middleware will automatically clear localStorage
   *
   * @returns Promise<void>
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      // Dispatch logout action
      dispatch(logoutUser());

      // The middleware has already cleared localStorage!
      // No need for clearLocalStorage()

      toast.showSuccess("You have been logged out successfully");

      // Redirection vers login
      navigate("/login");
    } catch (err) {
      throw err;
    }
  }, [dispatch, navigate, toast]);

  // ============================================
  // FORGOT PASSWORD
  // ============================================

  /**
   * Sends a password reset email
   *
   * @param email - User's email
   * @returns Promise<void>
   */
  const forgotResetPassword = useCallback(
    async (email: string): Promise<void> => {
      try {
        const result = await dispatch(
          sendResetPasswordEmail({ email })
        ).unwrap();

        toast.showSuccess(
          result.message || "Reset link has been sent to your email"
        );
      } catch (err: any) {
        toast.showError(err?.message || "Failed to send reset email");
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // RESET PASSWORD
  // ============================================

  /**
   * Resets the password using a token
   *
   * @param data - New password and token
   * @returns Promise<void>
   */
  const resetPasswordAuth = useCallback(
    async (data: DataResetPassword): Promise<void> => {
      try {
        // Validation
        if (data.password !== data.confirmPassword) {
          toast.showError("Passwords do not match");
          return;
        }

        const result = await dispatch(
          resetPasswordThunk({
            password: data.password,
            token: data.token,
          })
        ).unwrap();

        toast.showSuccess(result.message || "Password reset successful");

        // Redirect to login
        navigate("/login");
      } catch (err: any) {
        toast.showError(err?.message || "Failed to reset password");
      }
    },
    [dispatch, navigate, toast]
  );

  // ============================================
  // REFRESH USER
  // ============================================

  /**
   * Refreshes user data from the server
   * Useful for updating the profile after modification
   *
   * @returns Promise<boolean> - true if successful
   */
  const refreshUser = useCallback(async (): Promise<boolean> => {
    try {
      await dispatch(fetchCurrentUser()).unwrap();

      return true;
    } catch (err: any) {
      return err;
    }
  }, [dispatch]);

  // ============================================
  // UPDATE USER PROFILE
  // ============================================

  /**
   * Updates the user profile locally
   * For a real update, call an API then refreshUser()
   *
   * @param updates - Partial data to update
   */
  const updateUserProfile = useCallback(
    (updates: Partial<User>): void => {
      if (user) {
        // TODO: Appeler l'API de mise à jour profil
        // Puis rafraîchir les données
        // await updateProfileAPI(updates);
        // await refreshUser();

        toast.showInfo("Profile update feature coming soon");
      }
    },
    [user, toast]
  );

  // ============================================
  // CHECK AUTH
  // ============================================

  /**
   * Checks if the user is authenticated
   *
   * @returns boolean
   */
  const checkAuth = useCallback((): boolean => {
    return isAuthenticated && !!user && !!token;
  }, [isAuthenticated, user, token]);

  // ============================================
  // REFRESH AUTH (Token refresh)
  // ============================================

  /**
   * Refreshes the authentication token
   * To be implemented according to your refresh token strategy
   *
   * @returns Promise<boolean> - true if successful
   */
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    if (!refreshToken) {
      return false;
    }

    try {
      // TODO: Implémenter la logique de refresh token
      // const newTokens = await refreshTokensAPI(refreshToken);
      // dispatch(setTokens(newTokens));

      return true;
    } catch (err) {
      // If refresh fails, logout
      await logout();
      return false;
    }
  }, [refreshToken, logout]);

  // ============================================
  // MEMOIZED RETURN VALUE
  // ============================================

  /**
   * Memoized return value
   * Only recreated if dependencies change
   */
  const authContextValue = useMemo(
    () => ({
      // State
      user,
      token,
      refreshToken,
      loading,
      error,
      isAuthenticated,

      // Methods
      login,
      register,
      logout,
      checkAuth,
      refreshAuth,
      refreshUser,
      updateUserProfile,
      forgotResetPassword,
      resetPasswordAuth,
    }),
    [
      user,
      token,
      refreshToken,
      loading,
      error,
      isAuthenticated,
      login,
      register,
      logout,
      checkAuth,
      refreshAuth,
      refreshUser,
      updateUserProfile,
      forgotResetPassword,
      resetPasswordAuth,
    ]
  );

  return authContextValue;
};

/**
 * ============================================
 * USAGE NOTES
 * ============================================
 *
 * ADVANTAGES of this new version:
 *
 * 1. SIMPLICITY
 *    - No more need for useLocalStorage for auth
 *    - No more manual synchronization
 *    - Redux is the single source of truth
 *
 * 2. AUTOMATION
 *    - Middleware automatically manages localStorage
 *    - Saves on login/register
 *    - Cleans up on logout
 *
 * 3. PERFORMANCE
 *    - Fewer unnecessary re-renders
 *    - No state duplication
 *    - Optimized memoization
 *
 * 4. MAINTAINABILITY
 *    - Shorter and clearer code
 *    - Fewer potential bugs
 *    - Easier to test and extend
 *
 * ============================================
 * CHANGES vs old version:
 * ============================================
 *
 * ❌ REMOVED:
 *    - useLocalStorage for user/token/refreshToken
 *    - clearLocalStorage (middleware handles it)
 *    - Manual synchronization Redux ↔ localStorage
 *    - logoutUser API call (to be implemented if necessary)
 *
 * ✅ ADDED:
 *    - refreshUser() to refresh data
 *    - Better error handling
 *    - Simpler and more direct code
 *
 * ============================================
 */
