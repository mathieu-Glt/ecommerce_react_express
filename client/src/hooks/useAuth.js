import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useToast from "./useToast";
import {
  loginWithEmailAction,
  loginWithGoogleAction,
  registerAction,
  logout,
  getCurrentUserAction,
  updateUserProfileAction,
  clearAuthErrors,
  loginWithAzureAction,
} from "../actions/authActions";

/**
 * Hook personnalisé pour gérer l'authentification via Redux Actions
 * Remplace useLogin et useRegister en utilisant les actions Redux
 */
function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    auth: authMessages,
    showSuccess,
    showError,
    showLoading,
    updateToSuccess,
    updateToError,
  } = useToast();

  // Sélecteurs Redux
  const { user, token, loading, error, isAuthenticated } = useSelector(
    (state) => state.user
  );

  // Login with email
  const loginWithEmail = async (email, password, redirectTo = "/") => {
    console.log("loginWithEmail :", email, password, redirectTo);
    const loadingToast = showLoading("Connection in progress...");
    try {
      const result = await dispatch(loginWithEmailAction(email, password));
      console.log("loginWithEmail result :", result);
      updateToSuccess(
        loadingToast,
        authMessages.loginSuccess(result.data.user)
      );
      navigate(redirectTo, { replace: true });
      return result;
    } catch (err) {
      updateToError(loadingToast, authMessages.loginError);
      throw err;
    }
  };
  // Login with Azure
  const loginWithAzure = async (redirectTo = "/") => {
    const loadingToast = showLoading("Azure Connection in progress...");
    try {
      const result = await dispatch(loginWithAzureAction());
      updateToSuccess(loadingToast, authMessages.azureLoginSuccess);
      navigate(redirectTo, { replace: true });
      return result;
    } catch (err) {
      updateToError(loadingToast, authMessages.azureLoginError);
      throw err;
    }
  };

  // Login with Google
  const loginWithGoogle = async (redirectTo = "/") => {
    const loadingToast = showLoading("Google Connection in progress...");
    try {
      const result = await dispatch(loginWithGoogleAction());
      updateToSuccess(loadingToast, authMessages.googleLoginSuccess);
      navigate(redirectTo, { replace: true });
      return result;
    } catch (err) {
      updateToError(loadingToast, authMessages.googleLoginError);
      throw err;
    }
  };

  // Register
  const register = async (userData, redirectTo = "/") => {
    const loadingToast = showLoading("Registration in progress...");
    try {
      const result = await dispatch(registerAction(userData));
      updateToSuccess(
        loadingToast,
        authMessages.registerSuccess(result.data.user)
      );
      navigate(redirectTo, { replace: true });
      return result;
    } catch (err) {
      updateToError(loadingToast, authMessages.registerError);
      throw err;
    }
  };

  // Logout
  const logout = async (redirectTo = "/login") => {
    try {
      await dispatch(logout());
      showSuccess(authMessages.logoutSuccess);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      showError("Error during logout");
      throw err;
    }
  };

  // Get current user
  // const getCurrentUser = async (token) => {
  //   try {
  //     const result = await dispatch(getCurrentUserAction(token));
  //     return result;
  //   } catch (err) {
  //     throw err;
  //   }
  // };

  // Update user profile
  const updateUserProfile = async (userData, token) => {
    const loadingToast = showLoading("Profile update in progress...");
    try {
      const result = await dispatch(updateUserProfileAction(userData, token));
      updateToSuccess(loadingToast, authMessages.profileUpdated);
      return result;
    } catch (err) {
      updateToError(loadingToast, authMessages.profileUpdateError);
      throw err;
    }
  };

  // Clear errors
  const clearErrors = () => {
    dispatch(clearAuthErrors());
  };

  return {
    // État Redux
    user,
    token,
    loading,
    error,
    isAuthenticated,

    // Actions
    loginWithEmail,
    loginWithGoogle,
    loginWithAzure,
    register,
    logout,
    // getCurrentUser,
    updateUserProfile,
    clearErrors,
  };
}

export default useAuth;
