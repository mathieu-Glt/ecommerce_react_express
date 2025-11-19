import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  LoginCredentials,
  RegisterCredentials,
  ResponseDataLogin,
  ResponseDataRegister,
  User,
} from "../../interfaces/user.interface";
import type {
  ResponseErrorInterface,
  LogoutSuccessResponse,
  ApiResponse,
  FetchCurrentUserResponse,
} from "../../interfaces/response.interface";
import {
  getCurrentUser,
  signIn,
  signOut,
  signUp,
} from "../../services/api/auth";
import type { RegisterFormData } from "../../interfaces/regsiterProps.interface";
import { logout } from "../slices/authSlice";

// ==============================
// 🔐 LOGIN
// ==============================
export const loginUser = createAsyncThunk<
  ApiResponse,
  LoginCredentials,
  { rejectValue: ResponseErrorInterface }
>("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    const response = await signIn(credentials);
    const { user, token, refreshToken } = response;
    return { success: true, results: { user, token, refreshToken } };
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      error: err.response?.data?.message || "Login failed",
    });
  }
});

// ==============================
// 📝 REGISTER
// ==============================
export const registerUser = createAsyncThunk<
  ApiResponse,
  RegisterFormData,
  { rejectValue: ResponseErrorInterface }
>("auth/registerUser", async (userInfo, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("firstname", userInfo.firstname);
    formData.append("lastname", userInfo.lastname);
    formData.append("email", userInfo.email);
    formData.append("password", userInfo.password);
    formData.append("confirmPassword", userInfo.confirmPassword || "");

    if (userInfo.address) formData.append("address", userInfo.address);
    if (userInfo.picture instanceof File)
      formData.append("picture", userInfo.picture);

    const response = await signUp(formData);
    const { user } = response as ResponseDataRegister;

    return { success: true, results: { user } };
  } catch (err: any) {
    const errorMessage =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      "Registration failed";

    return thunkAPI.rejectWithValue({ success: false, error: errorMessage });
  }
});

// ==============================
// 🚪 LOGOUT
// ==============================
export const logoutThunk = createAsyncThunk<
  LogoutSuccessResponse,
  void,
  { rejectValue: ResponseErrorInterface }
>("auth/logoutUser", async (_, thunkAPI) => {
  try {
    const response = await signOut(); // Appel à l'API pour la déconnexion
    // Cleanup of localStorage will be handled in the reducer
    // Provide a value cast to any to satisfy the action's required-argument type
    if (response.success) {
      // Cleanup will be handled in the reducer
      thunkAPI.dispatch(logout(undefined as any));
    }

    return { success: true, message: response.message || "Logout successful" };
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      error: err?.response?.data?.message || "Logout failed",
    });
  }
});

// ==============================
// 👤 FETCH CURRENT USER
// ==============================
export const fetchCurrentUser = createAsyncThunk<
  FetchCurrentUserResponse,
  void,
  { rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const user = JSON.parse(storedUser) as User;
        return { success: true, user, token: storedToken };
      } catch (parseError) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }

    if (!storedToken) return rejectWithValue("No authentication token found");

    const response = await getCurrentUser(storedToken);

    if (response.success && response.user) {
      return { success: true, user: response.user, token: storedToken };
    }

    return rejectWithValue("Invalid user data received from server");
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to fetch current user");
  }
});
