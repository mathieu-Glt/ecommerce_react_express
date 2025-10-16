import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosResponse } from "axios";
import type {
  LoginCredentials,
  RegisterCredentials,
  ResponseDataLogin,
  ResponseDataRegister,
} from "../../interfaces/user.interface";
import type {
  ResponseErrorInterface,
  LogoutSuccessResponse,
  ApiResponse,
} from "../../interfaces/response.interface";
import { signIn, signOut, signUp } from "../../services/api/auth";
import type { RegisterFormData } from "../../interfaces/regsiterProps.interface";

export const loginUser = createAsyncThunk<
  ApiResponse,
  LoginCredentials,
  { rejectValue: ResponseErrorInterface }
>("auth/loginUser", async (credentials, thunkAPI) => {
  try {
    // const response: AxiosResponse<ResponseDataLogin> = await axios.post(
    //   "/api/auth/login",d
    //   credentials
    // );
    const response = await signIn(credentials);
    console.log("Response from signIn:", response);
    const { user, token, refreshToken } = response as ResponseDataLogin;
    return { success: true, results: { user, token, refreshToken } };
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      error: err.response?.data?.message || "Login failed",
    });
  }
});

export const registerUser = createAsyncThunk<
  ApiResponse,
  RegisterFormData,
  { rejectValue: ResponseErrorInterface }
>("auth/registerUser", async (userInfo, thunkAPI) => {
  console.log("Registering user with info:", userInfo);
  try {
    // const response: AxiosResponse<ResponseDataRegister> = await axios.post(
    //   "/api/auth/register",
    //   userInfo
    // );
    // Créer le FormData à partir de userInfo
    const formData = new FormData();
    formData.append("firstname", userInfo.firstname);
    formData.append("lastname", userInfo.lastname);
    formData.append("email", userInfo.email);
    formData.append("password", userInfo.password);
    formData.append("confirmPassword", userInfo.confirmPassword || "");

    // Ajouter l'adresse si présente
    if (userInfo.address) {
      formData.append("address", userInfo.address);
    }

    // Ajouter le fichier si présent
    if (userInfo.picture instanceof File) {
      formData.append("picture", userInfo.picture);
      console.log("📎 File added to FormData:", {
        name: userInfo.picture.name,
        size: userInfo.picture.size,
        type: userInfo.picture.type,
      });
    }
    console.log("📦 FormData content:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}:`, {
          name: value.name,
          size: value.size,
          type: value.type,
        });
      } else {
        console.log(`  ${key}:`, value);
      }
    }
    const response = await signUp(formData);
    console.log("Response from signUp:", response);
    const { user } = response as ResponseDataRegister;
    return { success: true, results: { user } };
  } catch (err: any) {
    console.error("❌ Registration error:", err);

    // ✅ Extraction robuste du message d'erreur
    const errorMessage =
      err.response?.data?.error || // Backend : { error: "..." }
      err.response?.data?.message || // Backend : { message: "..." }
      err.message || // Axios error message
      "Registration failed"; // Fallback

    console.log("📤 Rejecting with error:", errorMessage);

    return thunkAPI.rejectWithValue({
      success: false,
      error: errorMessage,
    });
  }
});

export const logoutUser = createAsyncThunk<
  LogoutSuccessResponse,
  {},
  { rejectValue: ResponseErrorInterface }
>("auth/logoutUser", async (_, thunkAPI) => {
  try {
    const response = await signOut();
    return {
      success: true,
      message: response.message || "Logout successful",
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      error: err?.response?.data?.message || "Logout failed",
    });
  }
});
