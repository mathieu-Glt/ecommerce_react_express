import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction, Slice } from "@reduxjs/toolkit";
import type {
  AuthState,
  payloadDataRefreshToken,
  payloadDataToken,
  payloadDataUser,
} from "../../interfaces/user.interface";
import type { User } from "../../interfaces/user.interface";
import { loginUser, registerUser, fetchCurrentUser } from "../thunks/authThunk";
import { loadAuthStateFromLocalStorage } from "../middleware/localStorageMiddleware";

// ============================================
// HYDRATION - Loading from localStorage
// ============================================

/**
 * Loads the authentication state from localStorage on startup
 * Executes only once when the file is imported
 */
const persistedAuth = loadAuthStateFromLocalStorage();

// ============================================
// INITIAL STATE
// ============================================

/**
 * Initial authentication state
 * Hydrated with localStorage data if available
 */
const initialState: AuthState = persistedAuth || {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  error: null,
  loading: false,
};

// ============================================
// SLICE REDUX
// ============================================

/**
 * Redux slice for managing authentication and the connected user
 *
 * Manages:
 * - Login/Logout
 * - Registration
 * - Fetching the current user
 * - Authentication tokens
 * - Connected user profile
 *
 * Note: The localStorage middleware automatically synchronizes
 * all changes with localStorage
 */
const authSlice: Slice<AuthState> = createSlice({
  name: "auth",
  initialState,

  // ============================================
  // REDUCERS SYNCHRONES
  // ============================================
  reducers: {
    /**
     * Completely resets the authentication state
     * Used during logout or to reset the app
     *
     * Note: The middleware will automatically clear localStorage
     */
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    /**
     * Sets the authentication tokens
     *
     * @param action - Payload containing token and optionally refreshToken
     *
     * Note: The middleware will automatically save to localStorage
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

    /**
     * Sets the connected user
     *
     * @param action - Payload containing user data
     *
     * Used for:
     * - Updating the user profile
     * - Setting the user after a manual action
     *
     * Note: The middleware will automatically save to localStorage
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    /**
     * Logs out the user
     * Alias of clearAuthState for a more explicit API
     *
     * Note: The middleware will automatically clear localStorage
     */
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    /**
     * Sets the loading state
     *
     * @param action - Boolean indicating if a loading is in progress
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Sets an error
     *
     * @param action - Error message or null to clear
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },

  // ============================================
  // EXTRA REDUCERS - Thunks asynchrones
  // ============================================
  extraReducers: (builder) => {
    builder
      // ==========================================
      // LOGIN USER
      // ==========================================
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = (action.payload.results as payloadDataUser).user ?? null;
        state.token =
          (action.payload.results as payloadDataToken).token ?? null;
        state.refreshToken =
          (action.payload.results as payloadDataRefreshToken).refreshToken ??
          null;
        state.isAuthenticated = true;
        state.error = null;

        // The middleware will automatically save to localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;

        // The middleware will automatically clear localStorage
      })

      // ==========================================
      // REGISTER USER
      // ==========================================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = (action.payload as payloadDataUser).user ?? null;
        state.token = null; // No token after registration (must log in)
        state.isAuthenticated = true;
        state.error = null;

        // The middleware will automatically save to localStorage
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // ==========================================
      // FETCH CURRENT USER
      // Fetch the currently authenticated user
      // ==========================================
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;

        // Update user if present
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }

        // Update token if present
        if (action.payload.token) {
          state.token = action.payload.token;
        }

        state.error = null;

        // The middleware will automatically save to localStorage
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch current user";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;

        // The middleware will automatically clear localStorage
      });
  },
});

// ============================================
// EXPORTS
// ============================================

/**
 * Actions exported for use in components
 *
 * Common uses:
 * - dispatch(setUser(newUser)) - Update profile
 * - dispatch(logout()) - Log out user
 * - dispatch(setTokens({ token, refreshToken })) - Set tokens
 */
export const {
  clearAuthState,
  setTokens,
  setUser,
  logout,
  setLoading,
  setError,
} = authSlice.actions;

/**
 * Default reducer for the Redux store
 */
export default authSlice.reducer;

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * EXAMPLE 1: Display the logged-in user
 *
 * ```typescript
 * import { useAppSelector } from '../store/store';
 *
 * function UserProfile() {
 *   const { user, isAuthenticated, loading } = useAppSelector(
 *     state => state.auth
 *   );
 *
 *   if (loading) return <Spinner />;
 *   if (!isAuthenticated) return <Login />;
 *
 *   return (
 *     <div>
 *       <h1>{user?.name}</h1>
 *       <p>{user?.email}</p>
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * EXAMPLE 2: Log out
 *
 * ```typescript
 * import { useAppDispatch } from '../store/store';
 * import { logout } from '../store/slices/authSlice';
 *
 * function LogoutButton() {
 *   const dispatch = useAppDispatch();
 *
 *   const handleLogout = () => {
 *     dispatch(logout());
 *     // Le middleware nettoie automatiquement localStorage
 *     navigate('/login');
 *   };
 *
 *   return <button onClick={handleLogout}>Déconnexion</button>;
 * }
 * ```
 */

/**
 * EXAMPLE 3: Update profile
 *
 * ```typescript
 * import { setUser } from '../store/slices/authSlice';
 *
 * function EditProfile() {
 *   const dispatch = useAppDispatch();
 *
 *   const handleUpdate = async (newData) => {
 *     // 1. Appeler l'API
 *     const updatedUser = await updateUserAPI(newData);
 *
 *     // 2. Mettre à jour Redux
 *     dispatch(setUser(updatedUser));
 *     // Le middleware sauvegarde automatiquement dans localStorage
 *   };
 *
 *   return <form onSubmit={handleUpdate}>...</form>;
 * }
 * ```
 */

/**
 * EXAMPLE 4: Fetch current user on startup
 *
 * ```typescript
 * import { fetchCurrentUser } from '../store/thunks/authThunk';
 *
 * function App() {
 *   const dispatch = useAppDispatch();
 *
 *   useEffect(() => {
 *     // Vérifie localStorage puis fait une requête API si nécessaire
 *     dispatch(fetchCurrentUser());
 *   }, [dispatch]);
 *
 *   return <Routes>...</Routes>;
 * }
 * ```
 */
