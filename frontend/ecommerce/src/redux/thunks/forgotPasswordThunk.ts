import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiResponse } from "../../interfaces/response.interface";
import { sentEmailResetPasswordApi } from "../../services/api/forgotPassword";

export const sendResetPasswordEmail = createAsyncThunk<
  ApiResponse,
  { email: string },
  { rejectValue: ApiResponse }
>("forgotPassword/sendResetPasswordEmail", async (data, thunkAPI) => {
  try {
    const response = await sentEmailResetPasswordApi(data.email);
    return { success: true, results: response };
  } catch (err: any) {
    return thunkAPI.rejectWithValue({
      success: false,
      error:
        err.response?.data?.message || "Failed to send reset password email",
    });
  }
});
