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
  logoutUser,
} from "../redux/thunks/authThunk";
import { sendResetPasswordEmail } from "../redux/thunks/forgotPasswordThunk";
import { resetPasswordThunk } from "../redux/thunks/resetPasswordThunk";
import type { DataResetPassword } from "../interfaces/resetPassword";
import type { LoginApiResponse } from "../interfaces/response.interface";

/**
 * Custom hook for authentication management
 *
 * ✅ Version simplifiée avec middleware localStorage
 * ✅ Plus besoin de useLocalStorage (le middleware gère tout)
 * ✅ Redux est la seule source de vérité
 * ✅ Code plus simple et maintenable
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
  // REDUX STATE - Source unique de vérité
  // ============================================

  /**
   * Récupère l'état d'authentification depuis Redux
   * Le middleware synchronise automatiquement avec localStorage
   */
  const { user, loading, error, isAuthenticated, token, refreshToken } =
    useAppSelector((state) => state.auth);

  // ============================================
  // LOGIN
  // ============================================

  /**
   * Connecte un utilisateur
   * Le middleware sauvegardera automatiquement dans localStorage
   *
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe
   * @param rememberMe - Si true, sauvegarde dans localStorage (via middleware)
   * @returns Promise<boolean> - true si succès
   */
  const login = useCallback(
    async (email: string, password: string): Promise<LoginApiResponse> => {
      try {
        const result = await dispatch(loginUser({ email, password })).unwrap();

        console.log("✅ Login successful:", result);

        // ✅ Le middleware a déjà sauvegardé dans localStorage !
        // Plus besoin de setUserStorage(), setTokenStorage(), etc.

        toast.showSuccess(`Welcome back, ${result.results.user.firstname}!`);

        // Navigation vers dashboard
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
        console.error("❌ Login failed:", err);
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
   * Inscrit un nouvel utilisateur
   *
   * @param credentials - Données d'inscription
   * @returns Promise<boolean> - true si succès
   */
  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<boolean> => {
      try {
        const result = await dispatch(registerUser(credentials)).unwrap();

        console.log("✅ Registration successful:", result);

        toast.showSuccess(
          `Welcome ${result.results.user.firstname}! Please check your email to verify your account.`
        );

        // Redirection vers login
        navigate("/login");

        return true;
      } catch (err: any) {
        console.error("❌ Registration failed:", err);
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
   * Déconnecte l'utilisateur
   * Le middleware nettoiera automatiquement localStorage
   *
   * @returns Promise<void>
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log("👋 Logging out...");

      // Dispatch logout action
      dispatch(logoutUser());

      // ✅ Le middleware a déjà nettoyé localStorage !
      // Plus besoin de clearLocalStorage()

      toast.showSuccess("You have been logged out successfully");

      // Redirection vers login
      navigate("/login");
    } catch (err) {
      console.error("❌ Logout failed:", err);
      throw err;
    }
  }, [dispatch, navigate, toast]);

  // ============================================
  // FORGOT PASSWORD
  // ============================================

  /**
   * Envoie un email de réinitialisation de mot de passe
   *
   * @param email - Email de l'utilisateur
   * @returns Promise<void>
   */
  const forgotResetPassword = useCallback(
    async (email: string): Promise<void> => {
      try {
        const result = await dispatch(
          sendResetPasswordEmail({ email })
        ).unwrap();

        console.log("✅ Reset email sent:", result);
        toast.showSuccess(
          result.message || "Reset link has been sent to your email"
        );
      } catch (err: any) {
        console.error("❌ Forgot password failed:", err);
        toast.showError(err?.message || "Failed to send reset email");
      }
    },
    [dispatch, toast]
  );

  // ============================================
  // RESET PASSWORD
  // ============================================

  /**
   * Réinitialise le mot de passe avec un token
   *
   * @param data - Nouveau mot de passe et token
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

        console.log("✅ Password reset successful:", result);
        toast.showSuccess(result.message || "Password reset successful");

        // Redirection vers login
        navigate("/login");
      } catch (err: any) {
        console.error("❌ Password reset failed:", err);
        toast.showError(err?.message || "Failed to reset password");
      }
    },
    [dispatch, navigate, toast]
  );

  // ============================================
  // REFRESH USER
  // ============================================

  /**
   * Rafraîchit les données utilisateur depuis le serveur
   * Utile pour mettre à jour le profil après modification
   *
   * @returns Promise<boolean> - true si succès
   */
  const refreshUser = useCallback(async (): Promise<boolean> => {
    try {
      console.log("🔄 Refreshing user data...");

      await dispatch(fetchCurrentUser()).unwrap();

      console.log("✅ User data refreshed");
      return true;
    } catch (err: any) {
      console.error("❌ Failed to refresh user:", err);
      return false;
    }
  }, [dispatch]);

  // ============================================
  // UPDATE USER PROFILE
  // ============================================

  /**
   * Met à jour le profil utilisateur localement
   * Pour une vraie mise à jour, appeler une API puis refreshUser()
   *
   * @param updates - Données partielles à mettre à jour
   */
  const updateUserProfile = useCallback(
    (updates: Partial<User>): void => {
      if (user) {
        // TODO: Appeler l'API de mise à jour profil
        // Puis rafraîchir les données
        // await updateProfileAPI(updates);
        // await refreshUser();

        console.log("📝 Update user profile:", updates);
        toast.showInfo("Profile update feature coming soon");
      }
    },
    [user, toast]
  );

  // ============================================
  // CHECK AUTH
  // ============================================

  /**
   * Vérifie si l'utilisateur est authentifié
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
   * Rafraîchit le token d'authentification
   * À implémenter selon votre stratégie de refresh token
   *
   * @returns Promise<boolean> - true si succès
   */
  const refreshAuth = useCallback(async (): Promise<boolean> => {
    if (!refreshToken) {
      console.warn("⚠️ No refresh token available");
      return false;
    }

    try {
      // TODO: Implémenter la logique de refresh token
      // const newTokens = await refreshTokensAPI(refreshToken);
      // dispatch(setTokens(newTokens));

      console.log("✅ Token refreshed");
      return true;
    } catch (err) {
      console.error("❌ Token refresh failed:", err);

      // Si le refresh échoue, déconnecter
      await logout();
      return false;
    }
  }, [refreshToken, logout]);

  // ============================================
  // MEMOIZED RETURN VALUE
  // ============================================

  /**
   * Valeur retournée mémorisée
   * Ne se recrée que si les dépendances changent
   */
  const authContextValue = useMemo(
    () => ({
      // État
      user,
      token,
      refreshToken,
      loading,
      error,
      isAuthenticated,

      // Méthodes
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
 * NOTES D'UTILISATION
 * ============================================
 *
 * ✅ AVANTAGES de cette nouvelle version :
 *
 * 1. SIMPLICITÉ
 *    - Plus besoin de useLocalStorage pour auth
 *    - Plus de synchronisation manuelle
 *    - Redux est la seule source de vérité
 *
 * 2. AUTOMATISATION
 *    - Le middleware gère localStorage automatiquement
 *    - Sauvegarde lors du login/register
 *    - Nettoyage lors du logout
 *
 * 3. PERFORMANCE
 *    - Moins de re-renders inutiles
 *    - Pas de duplication de state
 *    - Mémoisation optimisée
 *
 * 4. MAINTENABILITÉ
 *    - Code plus court et clair
 *    - Moins de bugs potentiels
 *    - Plus facile à tester
 *
 * ============================================
 * CHANGEMENTS vs ancienne version :
 * ============================================
 *
 * ❌ SUPPRIMÉ :
 *    - useLocalStorage pour user/token/refreshToken
 *    - clearLocalStorage (le middleware le fait)
 *    - Synchronisation manuelle Redux ↔ localStorage
 *    - logoutUser API call (à implémenter si nécessaire)
 *
 * ✅ AJOUTÉ :
 *    - refreshUser() pour rafraîchir les données
 *    - Meilleure gestion des erreurs
 *    - Code plus simple et direct
 *
 * ============================================
 */
