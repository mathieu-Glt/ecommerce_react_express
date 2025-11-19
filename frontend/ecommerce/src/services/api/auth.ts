import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { useApi } from "../../hooks/useApi";
import type {
  LoginCredentials,
  RegisterCredentials,
} from "../../interfaces/user.interface";
import type {
  ApiResponse,
  CurrentUserResponse,
  LoginResponse,
} from "../../interfaces/response.interface";
import { API_ROUTES } from "../constants/api-routes";
import type { RegisterFormData } from "../../interfaces/regsiterProps.interface";

// Define BASE_URL or import from your config
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:5173";
// eslint-disable-next-line react-hooks/rules-of-hooks
const api: AxiosInstance = useApi();

/**
 * Registers a new user
 *
 * @param body - Registration information (email, password, firstname, lastname, picture)
 * @returns Created user data and success message
 * @throws {Error} If email already exists or data is invalid
 *
 * @example
 * const response = await signUp({
 *   email: "user@example.com",
 *   password: "SecurePass123",
 *   firstname: "John",
 *   lastname: "Doe",
 *   picture: "data:image/png;base64,..."
 * });
 */
export async function signUp(
  body: RegisterFormData | FormData
): Promise<ApiResponse> {
  try {
    const register: AxiosResponse<ApiResponse> = await api.post(
      API_ROUTES.AUTH.REGISTER,
      body
    );
    return register.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error);
    }

    throw new Error("Failed during signUp");
  }
}

/**
 * Authenticates a user with email and password
 *
 * @param body - Login credentials (email and password)
 * @returns User data and authentication token
 * @throws {Error} If credentials are invalid or user not found
 *
 * @example
 * const response = await signIn({
 *   email: "user@example.com",
 *   password: "MyPassword123"
 * });
 *
 * // Store token and user data
 * localStorage.setItem("token", response.token);
 * localStorage.setItem("user", JSON.stringify(response.user));
 */
export async function signIn(body: LoginCredentials): Promise<LoginResponse> {
  try {
    const login: AxiosResponse<LoginResponse> = await api.post(
      API_ROUTES.AUTH.LOGIN,
      body
    );
    return login.data;
  } catch (error: any) {
    // Check the structure rather than the instance
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed during signIn";

    throw new Error(errorMessage);
  }
}

/**
 * Reset user password
 *
 * @param body - Object containing email and optional phone number
 * @return Success message if reset link sent
 *
 * @throws {Error} If request fails or server is unreachable
 *
 * @example
 * try {
 *   const response = await sentEmailResetPassword({ email: "user@example.com" });
 */

export async function resetPassword(body: {}): Promise<any> {
  try {
    const reset = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, body);
    return reset.data;
  } catch (error) {
    throw new Error("Failed during resetPassword");
  }
}

/**
 * Retrieves the authenticated user's profile information
 *
 * @returns User profile data including personal information and settings
 * @throws {Error} If user is not authenticated or profile not found
 * @throws {Error} If the request fails or server is unreachable
 *
 * @example
 * try {
 *   const profile = await getUserProfile();
 * } catch (error) {
 * }
 *
 * @example
 * // Usage in component
 * useEffect(() => {
 *   const loadProfile = async () => {
 *     try {
 *       const profile = await getUserProfile();
 *       setUser(profile.user);
 *     } catch (error) {
 *       navigate("/login");
 *     }
 *   };
 *   loadProfile();
 * }, []);
 */
export async function getUserProfile(): Promise<ApiResponse | undefined> {
  try {
    const userProfile: AxiosResponse<ApiResponse> = await api.get(
      API_ROUTES.AUTH.GET_PROFILE
    );
    return userProfile.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || error.message || "Not User found"
      );
    }
    throw new Error("Not User found");
  }
}

/**
 * Signs out the current user and invalidates their session
 *
 * This method calls the logout endpoint to clear the user's session on the server
 * and should be followed by clearing local authentication data (tokens, user info).
 *
 * @returns Server response confirming logout success
 * @throws {Error} If logout request fails or server is unreachable
 *
 * @example
 * try {
 *   await signOut();
 *
 *   // Clear local storage
 *   localStorage.removeItem("token");
 *   localStorage.removeItem("user");
 *
 *   // Redirect to login
 *   navigate("/login");
 * } catch (error) {
 * }
 *
 * @example
 * // Usage in logout button handler
 * const handleLogout = async () => {
 *   try {
 *     await signOut();
 *     dispatch(clearAuthState());
 *     toast.success("Logged out successfully");
 *   } catch (error) {
 *     toast.error("Failed to logout");
 *   }
 * };
 */
export async function signOut(): Promise<ApiResponse> {
  try {
    const logout = await api.post(API_ROUTES.AUTH.LOGOUT);
    return logout.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || error.message || "Failed during signOut"
      );
    }
    throw new Error("Failed during signOut");
  }
}
// function refreshTokens
export async function refreshTokens() {
  const token = localStorage.getItem("refreshToken");
  const headers = {
    Authorization: "Bearer " + token,
  };

  try {
    const refreshResponse = await axios.get(
      // import.meta.env.VITE_API_BASE_URL + API_ROUTES.AUTH.REFRESH_TOKEN,
      BASE_URL + API_ROUTES.AUTH.REFRESH_TOKEN,
      { headers }
    );
    return refreshResponse;
  } catch (error) {
    throw new Error(" Failed to refresh token");
  }
}

// function destroytoken && user
export async function destroyTokenUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

/**
 * Retrieves the currently authenticated user
 *
 * @param token - JWT token for authentication
 * @returns User data if authenticated
 *
 * @throws Error if token is invalid (401) or user not found (404)
 *
 * @example
 * ```typescript
 * const response = await authService.getCurrentUser(token);
 * if (response.success) {
 * }
 * ```
 */
export async function getCurrentUser(
  token: string
): Promise<CurrentUserResponse> {
  try {
    const response: AxiosResponse<CurrentUserResponse> = await api.get(
      API_ROUTES.AUTH.CURRENT_USER,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true, // Pour les cookies de session
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error);
    }
    throw new Error("Failed to fetch current user");
  }
}

/// reflection on creating a service class
// class AuthService {
//   private api: AxiosInstance;
//
//   constructor(api: AxiosInstance) {
//     this.api = api;
//   }
//
//   async getCurrentUser(token: string): Promise<CurrentUserResponse> {
//     try {
//       const response: AxiosResponse<CurrentUserResponse> = await this.api.get(
//         API_ROUTES.AUTH.CURRENT_USER,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           withCredentials: true, // Pour les cookies de session
//         }
//       );
//       return response.data;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         throw new Error(error.response?.data?.error);
//       }
//       throw new Error("Failed to fetch current user");
//     }
//   }
// }
