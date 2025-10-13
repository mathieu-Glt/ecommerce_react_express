import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Slice } from "@reduxjs/toolkit";
import type {
  AuthState,
  payloadDataRefreshToken,
  payloadDataToken,
  payloadDataUser,
} from "../../interfaces/user.interface";
import type { User } from "../../interfaces/user.interface";
import { loginUser, registerUser } from "../thunks/authThunk";

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  error: null,
  loading: false,
};
// --- Slice ---
const authSlice: Slice<AuthState> = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Clears all authentication state
     * Used when logging out or resetting the app
     */
    clearAuthState: (state, action: PayloadAction<undefined>) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    /**
     * Sets authentication tokens
     * @param action - Payload containing token and refreshToken
     */
    setTokens: (
      state,
      action: PayloadAction<{ token: string; refreshToken?: string }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login fulfilled with payload:", action.payload);
        state.loading = false;
        state.user = (action.payload.results as payloadDataUser).user ?? null;
        state.token =
          (action.payload.results as payloadDataToken).token ?? null;
        state.refreshToken =
          (action.payload.results as payloadDataRefreshToken).refreshToken ??
          null;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = (action.payload as payloadDataUser).user ?? null;
        state.token = null;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});
export const { logout, setUser, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
