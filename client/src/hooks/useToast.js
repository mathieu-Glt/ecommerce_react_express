import { useCallback } from "react";
import { toast } from "react-toastify";

/**
 * Hook personnalisé pour gérer les notifications toast
 * Centralise la gestion des messages et évite la répétition de code
 */
function useToast() {
  // Configuration par défaut pour tous les toasts
  const defaultConfig = {
    position: "top-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  // Succès
  const showSuccess = useCallback((message, config = {}) => {
    console.log("message in showSuccess :: ", message);
    toast.success(message, { ...defaultConfig, ...config });
  }, []);

  // Erreur
  const showError = useCallback((message, config = {}) => {
    toast.error(message, { ...defaultConfig, ...config });
  }, []);

  //  Avertissement
  const showWarning = useCallback((message, config = {}) => {
    toast.warning(message, { ...defaultConfig, ...config });
  }, []);

  // Information
  const showInfo = useCallback((message, config = {}) => {
    toast.info(message, { ...defaultConfig, ...config });
  }, []);

  // Toast de chargement (pour les actions longues)
  const showLoading = useCallback((message = "Loading...", config = {}) => {
    return toast.loading(message, {
      ...defaultConfig,
      autoClose: false,
      ...config,
    });
  }, []);

  // Succès avec toast de chargement
  const updateToSuccess = useCallback((toastId, message = "Success !") => {
    toast.update(toastId, {
      render: message,
      type: "success",
      isLoading: false,
      autoClose: 3000,
    });
  }, []);

  // Erreur avec toast de chargement
  const updateToError = useCallback((toastId, message = "Error !") => {
    toast.update(toastId, {
      render: message,
      type: "error",
      isLoading: false,
      autoClose: 5000,
    });
  }, []);

  // Fermer un toast spécifique
  const dismissToast = useCallback((toastId) => {
    toast.dismiss(toastId);
  }, []);

  // Fermer tous les toasts
  const dismissAll = useCallback(() => {
    toast.dismiss();
  }, []);

  // Messages prédéfinis pour l'authentification
  const authMessages = {
    loginSuccess: (user) => `Welcome back ${user?.firstname || "User"} !`,
    loginError: "Login failed",
    googleLoginSuccess: "Login with Google success",
    azureLoginSuccess: "Login with Azure success",
    googleLoginError: "Login with Google failed",
    logoutSuccess: "Logout successful",
    registerSuccess: (user) =>
      `Welcome ${
        user?.firstname || "User"
      } ! Account created and you're now logged in!`,
    registerError: "Registration failed",
    passwordResetSent: "Password reset email sent",
    passwordResetError: "Password reset failed",
    profileUpdated: "Profile updated successfully",
    profileUpdateError: "Profile update failed",
  };

  // Messages prédéfinis pour les opérations CRUD
  const crudMessages = {
    createSuccess: (itemName) => `${itemName} created successfully`,
    createError: (itemName) => `Failed to create ${itemName}`,
    updateSuccess: (itemName) => `${itemName} updated successfully`,
    updateError: (itemName) => `Failed to update ${itemName}`,
    deleteSuccess: (itemName) => `${itemName} deleted successfully`,
    deleteError: (itemName) => `Failed to delete ${itemName}`,
    fetchSuccess: (itemName) => `${itemName} loaded successfully`,
    fetchError: (itemName) => `Failed to load ${itemName}`,
  };

  // Messages prédéfinis pour la validation
  const validationMessages = {
    requiredField: (fieldName) => `${fieldName} is required`,
    invalidEmail: "Please enter a valid email address",
    passwordTooShort: "Password must be at least 6 characters",
    passwordsDoNotMatch: "Passwords do not match",
    invalidFormat: (fieldName) => `Invalid ${fieldName} format`,
  };

  //  Messages prédéfinis pour les erreurs réseau
  const networkMessages = {
    connectionError: "Connection error. Please check your internet connection.",
    serverError: "Server error. Please try again later.",
    timeoutError: "Request timeout. Please try again.",
    unauthorized: "Unauthorized access. Please login again.",
    forbidden: "Access forbidden. You don't have permission.",
    notFound: "Resource not found.",
  };

  return {
    // Méthodes de base
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateToSuccess,
    updateToError,
    dismissToast,
    dismissAll,

    // Messages prédéfinis
    auth: authMessages,
    crud: crudMessages,
    validation: validationMessages,
    network: networkMessages,
  };
}

export default useToast;
