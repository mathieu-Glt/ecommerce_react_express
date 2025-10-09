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
  RegisterCredentials,
  { rejectValue: ResponseErrorInterface }
>("auth/registerUser", async (userInfo, thunkAPI) => {
  try {
    // const response: AxiosResponse<ResponseDataRegister> = await axios.post(
    //   "/api/auth/register",
    //   userInfo
    // );
    const response = await signUp(userInfo);
    const { user } = response as ResponseDataRegister;
    return { success: true, results: { user } };
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      error: err.response?.data?.message || "Registration failed",
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
