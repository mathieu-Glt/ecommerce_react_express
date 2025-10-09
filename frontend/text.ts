import axios from "axios";
import { useApi } from "../../hooks/useApi";

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

// eslint-disable-next-line react-hooks/rules-of-hooks
const api = useApi();

// Create or update user (authenticated)
export async function createOrUpdateUser(): Promise<ApiResponse | undefined> {
  try {
    const response = await api.post("/auth/create-or-update-user", {});
    return response;
  } catch (error) {
    console.error("Error creating/updating user:", error);
    throw error;
  }
}

// Register or update user
export async function registerOrUpdateUser(user: any): Promise<ApiResponse | undefined> {
  try {
    const response = await api.post("/user/register-user", user);
    return response;
  } catch (error) {
    console.error("Error registering/updating user:", error);
    throw error;
  }
}

// Sign up / Register
export async function signUp(body: RegisterData): Promise<ApiResponse | undefined> {
  try {
    const register = await api.post("/auth/register", body);
    return register;
  } catch (error) {
    console.error("Error during sign up:", error);
    throw error;
  }
}

// Sign in / Login with email
export async function signIn(body: LoginCredentials): Promise<ApiResponse | undefined> {
  console.log("🚀 ~ signIn ~ body:", body);
  try {
    const login = await api.post("/auth/login", body);
    console.log("🚀 ~ signIn ~ login:", login);
    return login;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
}

// Login with email (alias pour compatibilité)
export async function loginWithEmail(email: string, password: string): Promise<ApiResponse | undefined> {
  console.log("loginWithEmail:", email, password);
  return signIn({ email, password });
}

// Update user profile
export async function updateUserProfile(user: UserProfile): Promise<ApiResponse | undefined> {
  try {
    const response = await api.put("/auth/profile", user);
    return response;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

// Send email reset password
export async function sentEmailResetPassword(body: { email: string }): Promise<ApiResponse | undefined> {
  try {
    const sentEmail = await api.post("/auth/reset-password", body);
    return sentEmail;
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw error;
  }
}

// Sign out / Logout
export async function signOut(): Promise<ApiResponse | undefined> {
  try {
    const logout = await api.post("/auth/logout", {});
    return logout;
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
}

// Logout user (alias pour compatibilité)
export async function logoutUser(): Promise<ApiResponse | undefined> {
  return signOut();
}

// OAuth - Login with Google (redirect)
export function loginWithGoogle(): void {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/google`;
}

// OAuth - Login with Azure (redirect)
export function loginWithAzure(): void {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/azure`;
}

// Fetch Google user (OAuth callback)
export async function fetchGoogleUser(): Promise<ApiResponse | undefined> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/user`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Google user:", error);
    throw error;
  }
}

// Google OAuth callback
export async function loginWithGoogleCallback(): Promise<ApiResponse | undefined> {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/google/callback`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error in Google callback:", error);
    throw error;
  }
}

// Refresh tokens
export async function refreshTokens(): Promise<ApiResponse | undefined> {
  const token = localStorage.getItem("refreshToken");
  
  if (!token) {
    throw new Error("No refresh token available");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    const refreshResponse = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"}/auth/refresh-token`,
      { headers }
    );
    console.log("🚀 ~ refreshTokens ~ response:", refreshResponse);
    return refreshResponse.data;
  } catch (error) {
    console.error("Error refreshing tokens:", error);
    throw error;
  }
}

// Destroy tokens and user data from localStorage
export function destroyTokenUser(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

// Get current user from localStorage
export function getCurrentUser(): any | null {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const token = localStorage.getItem("accessToken");
  return !!token;
}