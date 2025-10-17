import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  ForgotPasswordResponse,
  ResponseErrorInterface,
} from "../../interfaces/response.interface";
import { sentEmailResetPasswordApi } from "../../services/api/forgotPassword";

export const sendResetPasswordEmail = createAsyncThunk<
  ForgotPasswordResponse,
  { email: string },
  { rejectValue: ResponseErrorInterface }
>("forgotPassword/sendResetPasswordEmail", async (data, thunkAPI) => {
  console.log("=== THUNK START ===");
  console.log("Data:", data);
  try {
    const response = await sentEmailResetPasswordApi(data);

    console.log("=== THUNK SUCCESS ===");
    console.log("Response:", response);
    console.log("Response type:", typeof response);
    console.log("Response keys:", Object.keys(response || {}));
    return {
      success: true,
      status: response.status,
      message: response.message,
      results: response.resetLink,
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      error:
        err.response?.data?.message || "Failed to send reset password email",
    });
  }
});
