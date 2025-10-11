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
import type { ApiResponse } from "../../interfaces/response.interface";
import { API_ROUTES } from "../constants/api-routes";

// eslint-disable-next-line react-hooks/rules-of-hooks
const api: AxiosInstance = useApi();

// export async function signUp(body: {email: string, password: string}): Promise<any> {
//   try {
//     const register = await api.post("/auth/register", body);
//     return register;
//   } catch (error) {
//     console.log(error);
//   }
// }

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
export async function signUp(body: RegisterCredentials): Promise<ApiResponse> {
  console.log("🚀 ~ file: auth.ts:47 ~ signUp ~ body:", body);
  try {
    const register: AxiosResponse<ApiResponse> = await api.post(
      API_ROUTES.AUTH.REGISTER,
      body
    );
    console.log("🚀 ~ file: auth.ts:53 ~ signUp ~ register:", register);
    return register.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || error.message || "Failed during signUp"
      );
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
export async function signIn(body: LoginCredentials): Promise<ApiResponse> {
  console.log("🚀 ~ file: auth.ts:66 ~ signIn ~ body:", body);
  try {
    const login: AxiosResponse<ApiResponse> = await api.post(
      API_ROUTES.AUTH.LOGIN,
      body
    );
    console.log("🚀 ~ file: auth.ts:69 ~ signIn ~ login:", login);
    return login.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.error || error.message || "Failed during signUp"
      );
    }
    throw new Error("Failed during signIn");
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
 *   console.log("User:", profile.user);
 * } catch (error) {
 *   console.error("Failed to load profile:", error.message);
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
// function send email reset password
export async function sentEmailResetPassword(body: {}): Promise<any> {
  try {
    const sentEmail = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, body);
    return sentEmail;
  } catch (error) {
    console.log("error auth" + error);
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
 *   console.error("Logout failed:", error.message);
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
    const logout = await api.get(API_ROUTES.AUTH.LOGOUT);
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
      import.meta.env.VITE_API_BASE_URL + API_ROUTES.AUTH.REFRESH_TOKEN,
      { headers }
    );
    console.log(
      ":rocket: ~ file: auth.tsx:55 ~ refreshToken ~ refreshToken:",
      refreshResponse
    );
    return refreshResponse;
  } catch (error) {
    throw new Error("");
  }
}

// function destroytoken && user
export async function destroyTokenUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}
