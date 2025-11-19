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
  try {
    const response = await sentEmailResetPasswordApi(data);

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
