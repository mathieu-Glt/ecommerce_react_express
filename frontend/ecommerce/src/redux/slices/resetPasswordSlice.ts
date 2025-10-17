import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  ApiResponse,
  ForgotPasswordResponse,
} from "../../interfaces/response.interface";
import type { ForgotPasswordState } from "../../interfaces/forgotPassword.interface";
import { sendResetPasswordEmail } from "../thunks/forgotPasswordThunk";
import type { ResetPasswordState } from "../../interfaces/resetPassword";

// -- Initial state -- //
const initialState: ResetPasswordState = {
  loading: false,
  success: null,
  error: null,
};

// --- Slice --- //
const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState,
  reducers: {
    clearForgotPasswordState: (state) => {
      state.loading = false;
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendResetPasswordEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(
        sendResetPasswordEmail.fulfilled,
        (state, action: PayloadAction<ForgotPasswordResponse>) => {
          state.loading = false;
          state.success = action.payload.message as string;
          state.error = null;
        }
      )
      .addCase(sendResetPasswordEmail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.error ||
          action.error?.message ||
          "Failed to send reset password email";
        state.success = null;
      });
  },
});

export const { clearForgotPasswordState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
