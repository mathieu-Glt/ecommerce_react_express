import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ApiResponse } from "../../interfaces/response.interface";
import type { ForgotPasswordState } from "../../interfaces/forgotPassword.interface";
import { sendResetPasswordEmail } from "../thunks/forgotPasswordThunk";

// -- Initial state -- //
const initialState: ForgotPasswordState = {
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
        (state, action: PayloadAction<ApiResponse>) => {
          state.loading = false;
          state.success = action.payload.results as string;
          state.error = null;
        }
      )
      .addCase(sendResetPasswordEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? (action.payload as any).error
          : "Failed to send reset password email";
        state.success = null;
      });
  },
});

export const { clearForgotPasswordState } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer;
