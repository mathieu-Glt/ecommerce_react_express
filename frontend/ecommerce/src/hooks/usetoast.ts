import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import type { Id } from "react-toastify";
import type { ToastContent } from "react-toastify";
import type { ToastOptions } from "react-toastify";
import type { User } from "../interfaces/user.interface";

/**
 * Configuration type for toast notifications
 */
interface ToastConfig extends Partial<ToastOptions> {
  position?:
    | "top-right"
    | "top-center"
    | "top-left"
    | "bottom-right"
    | "bottom-center"
    | "bottom-left";
  autoClose?: number | false;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
}

/**
 * Authentication messages interface
 */
interface AuthMessages {
  loginSuccess: (user?: User | null) => string;
  loginError: string;
  googleLoginSuccess: string;
  azureLoginSuccess: string;
  googleLoginError: string;
  logoutSuccess: string;
  registerSuccess: (user?: User | null) => string;
  registerError: string;
  passwordResetSent: string;
  passwordResetError: string;
  profileUpdated: string;
  profileUpdateError: string;
}

/**
 * CRUD messages interface
 */
interface CrudMessages {
  createSuccess: (itemName: string) => string;
  createError: (itemName: string) => string;
  updateSuccess: (itemName: string) => string;
  updateError: (itemName: string) => string;
  deleteSuccess: (itemName: string) => string;
  deleteError: (itemName: string) => string;
  fetchSuccess: (itemName: string) => string;
  fetchError: (itemName: string) => string;
}

/**
 * Validation messages interface
 */
interface ValidationMessages {
  requiredField: (fieldName: string) => string;
  invalidEmail: string;
  passwordTooShort: string;
  passwordsDoNotMatch: string;
  invalidFormat: (fieldName: string) => string;
}

/**
 * Network error messages interface
 */
interface NetworkMessages {
  connectionError: string;
  serverError: string;
  timeoutError: string;
  unauthorized: string;
  forbidden: string;
  notFound: string;
}

/**
 * Return type of useToast hook
 */
interface UseToastReturn {
  // Basic methods
  showSuccess: (message: ToastContent, config?: ToastConfig) => Id;
  showError: (message: ToastContent, config?: ToastConfig) => Id;
  showWarning: (message: ToastContent, config?: ToastConfig) => Id;
  showInfo: (message: ToastContent, config?: ToastConfig) => Id;
  showLoading: (message?: ToastContent, config?: ToastConfig) => Id;
  updateToSuccess: (toastId: Id, message?: ToastContent) => void;
  updateToError: (toastId: Id, message?: ToastContent) => void;
  dismissToast: (toastId: Id) => void;
  dismissAll: () => void;

  // Predefined messages
  auth: AuthMessages;
  crud: CrudMessages;
  validation: ValidationMessages;
  network: NetworkMessages;
}

/**
 * Custom hook for managing toast notifications
 * Centralizes message management and avoids code repetition
 *
 * @returns Object with toast methods and predefined messages
 *
 * @example
 * const toast = useToast();
 *
 * // Basic usage
 * toast.showSuccess("Operation successful!");
 * toast.showError("Something went wrong");
 *
 * // With user data
 * toast.showSuccess(toast.auth.loginSuccess(user));
 *
 * // Loading toast
 * const loadingId = toast.showLoading("Processing...");
 * // ... async operation
 * toast.updateToSuccess(loadingId, "Completed!");
 *
 * // CRUD operations
 * toast.showSuccess(toast.crud.createSuccess("User"));
 */
function useToast(): UseToastReturn {
  // Default configuration for all toasts - Memoized
  const defaultConfig: ToastConfig = useMemo(
    () => ({
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }),
    []
  );

  /**
   * Shows a success toast notification
   *
   * @param message - Message to display
   * @param config - Optional toast configuration
   * @returns Toast ID
   */
  const showSuccess = useCallback(
    (message: ToastContent, config: ToastConfig = {}): Id => {
      return toast.success(message, { ...defaultConfig, ...config });
    },
    [defaultConfig]
  );

  /**
   * Shows an error toast notification
   *
   * @param message - Error message to display
   * @param config - Optional toast configuration
   * @returns Toast ID
   */
  const showError = useCallback(
    (message: ToastContent, config: ToastConfig = {}): Id => {
      return toast.error(message, { ...defaultConfig, ...config });
    },
    [defaultConfig]
  );

  /**
   * Shows a warning toast notification
   *
   * @param message - Warning message to display
   * @param config - Optional toast configuration
   * @returns Toast ID
   */
  const showWarning = useCallback(
    (message: ToastContent, config: ToastConfig = {}): Id => {
      return toast.warning(message, { ...defaultConfig, ...config });
    },
    [defaultConfig]
  );

  /**
   * Shows an info toast notification
   *
   * @param message - Info message to display
   * @param config - Optional toast configuration
   * @returns Toast ID
   */
  const showInfo = useCallback(
    (message: ToastContent, config: ToastConfig = {}): Id => {
      return toast.info(message, { ...defaultConfig, ...config });
    },
    [defaultConfig]
  );

  /**
   * Shows a loading toast notification (for long actions)
   *
   * @param message - Loading message to display
   * @param config - Optional toast configuration
   * @returns Toast ID (use for updateToSuccess/updateToError)
   */
  const showLoading = useCallback(
    (message: ToastContent = "Loading...", config: ToastConfig = {}): Id => {
      return toast.loading(message, {
        ...defaultConfig,
        autoClose: false,
        ...config,
      });
    },
    [defaultConfig]
  );

  /**
   * Updates a loading toast to success
   *
   * @param toastId - ID of the toast to update
   * @param message - Success message
   */
  const updateToSuccess = useCallback(
    (toastId: Id, message: ToastContent = "Success!"): void => {
      toast.update(toastId, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    },
    []
  );

  /**
   * Updates a loading toast to error
   *
   * @param toastId - ID of the toast to update
   * @param message - Error message
   */
  const updateToError = useCallback(
    (toastId: Id, message: ToastContent = "Error!"): void => {
      toast.update(toastId, {
        render: message,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    },
    []
  );

  /**
   * Dismisses a specific toast
   *
   * @param toastId - ID of the toast to dismiss
   */
  const dismissToast = useCallback((toastId: Id): void => {
    toast.dismiss(toastId);
  }, []);

  /**
   * Dismisses all active toasts
   */
  const dismissAll = useCallback((): void => {
    toast.dismiss();
  }, []);

  // Predefined messages for authentication - Memoized
  const authMessages: AuthMessages = useMemo(
    () => ({
      loginSuccess: (user?: User | null) =>
        `Welcome back ${user?.firstname || "User"}!`,
      loginError: "Login failed",
      googleLoginSuccess: "Login with Google successful",
      azureLoginSuccess: "Login with Azure successful",
      googleLoginError: "Login with Google failed",
      logoutSuccess: "Logout successful",
      registerSuccess: (user?: User | null) =>
        `Welcome ${
          user?.firstname || "User"
        }! Account created and you're now logged in!`,
      registerError: "Registration failed",
      passwordResetSent: "Password reset email sent",
      passwordResetError: "Password reset failed",
      profileUpdated: "Profile updated successfully",
      profileUpdateError: "Profile update failed",
    }),
    []
  );

  // Predefined messages for CRUD operations - Memoized
  const crudMessages: CrudMessages = useMemo(
    () => ({
      createSuccess: (itemName: string) => `${itemName} created successfully`,
      createError: (itemName: string) => `Failed to create ${itemName}`,
      updateSuccess: (itemName: string) => `${itemName} updated successfully`,
      updateError: (itemName: string) => `Failed to update ${itemName}`,
      deleteSuccess: (itemName: string) => `${itemName} deleted successfully`,
      deleteError: (itemName: string) => `Failed to delete ${itemName}`,
      fetchSuccess: (itemName: string) => `${itemName} loaded successfully`,
      fetchError: (itemName: string) => `Failed to load ${itemName}`,
    }),
    []
  );

  // Predefined messages for validation - Memoized
  const validationMessages: ValidationMessages = useMemo(
    () => ({
      requiredField: (fieldName: string) => `${fieldName} is required`,
      invalidEmail: "Please enter a valid email address",
      passwordTooShort: "Password must be at least 8 characters",
      passwordsDoNotMatch: "Passwords do not match",
      invalidFormat: (fieldName: string) => `Invalid ${fieldName} format`,
    }),
    []
  );

  // Predefined messages for network errors - Memoized
  const networkMessages: NetworkMessages = useMemo(
    () => ({
      connectionError:
        "Connection error. Please check your internet connection.",
      serverError: "Server error. Please try again later.",
      timeoutError: "Request timeout. Please try again.",
      unauthorized: "Unauthorized access. Please login again.",
      forbidden: "Access forbidden. You don't have permission.",
      notFound: "Resource not found.",
    }),
    []
  );

  // Memoized return value to prevent unnecessary re-renders
  return useMemo(
    () => ({
      // Basic methods
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showLoading,
      updateToSuccess,
      updateToError,
      dismissToast,
      dismissAll,

      // Predefined messages
      auth: authMessages,
      crud: crudMessages,
      validation: validationMessages,
      network: networkMessages,
    }),
    [
      showSuccess,
      showError,
      showWarning,
      showInfo,
      showLoading,
      updateToSuccess,
      updateToError,
      dismissToast,
      dismissAll,
      authMessages,
      crudMessages,
      validationMessages,
      networkMessages,
    ]
  );
}

export default useToast;
