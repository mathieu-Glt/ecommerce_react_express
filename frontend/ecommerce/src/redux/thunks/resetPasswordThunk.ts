import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ResetPasswordResponse,
  ResponseErrorInterface,
} from "../../interfaces/response.interface";
import { resetPasswordApi } from "../../services/api/resetPassword";
// import { sentEmailResetPasswordApi } from "../../services/api/forgotPassword";

export const resetPasswordThunk = createAsyncThunk<
  ResetPasswordResponse,
  { password: string; token: string },
  { rejectValue: ResponseErrorInterface }
>("resetPassword/resetPassword", async (data, thunkAPI) => {
  console.log("=== RESET PASSWORD THUNK START ===");
  console.log("Data:", data);
  try {
    const response = await resetPasswordApi(data);
    // Simulating API response for demonstration purposes
    console.log("=== RESET PASSWORD THUNK SUCCESS ===");
    console.log("Response:", response);
    console.log("Response type:", typeof response);
    console.log("Response keys:", Object.keys(response || {}));
    return {
      success: true,
      status: response.status,
      message: response.message,
      results: response.resetConfirmation,
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      error: err.response?.data?.message || "Failed to reset password",
    });
  }
});
