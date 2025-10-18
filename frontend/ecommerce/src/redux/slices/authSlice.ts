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
// HYDRATATION - Chargement depuis localStorage
// ============================================

/**
 * Charge l'état d'authentification depuis localStorage au démarrage
 * S'exécute une seule fois lors de l'import du fichier
 */
const persistedAuth = loadAuthStateFromLocalStorage();

console.log("🌊 [authSlice] État persisté chargé:", persistedAuth);

// ============================================
// ÉTAT INITIAL
// ============================================

/**
 * État initial de l'authentification
 * Hydraté avec les données de localStorage si disponibles
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
 * Slice Redux pour la gestion de l'authentification et de l'utilisateur connecté
 *
 * Gère :
 * - Connexion/Déconnexion
 * - Inscription
 * - Récupération de l'utilisateur actuel
 * - Tokens d'authentification
 * - Profil utilisateur connecté
 *
 * Note : Le middleware localStorage synchronise automatiquement
 * toutes les modifications avec le localStorage
 */
const authSlice: Slice<AuthState> = createSlice({
  name: "auth",
  initialState,

  // ============================================
  // REDUCERS SYNCHRONES
  // ============================================
  reducers: {
    /**
     * Réinitialise complètement l'état d'authentification
     * Utilisé lors de la déconnexion ou pour réinitialiser l'app
     *
     * Note : Le middleware nettoiera automatiquement localStorage
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
     * Définit les tokens d'authentification
     *
     * @param action - Payload contenant token et optionnellement refreshToken
     *
     * Note : Le middleware sauvegardera automatiquement dans localStorage
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
     * Définit l'utilisateur connecté
     *
     * @param action - Payload contenant les données utilisateur
     *
     * Utilisé pour :
     * - Mettre à jour le profil utilisateur
     * - Définir l'utilisateur après une action manuelle
     *
     * Note : Le middleware sauvegardera automatiquement dans localStorage
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    /**
     * Déconnecte l'utilisateur
     * Alias de clearAuthState pour une API plus explicite
     *
     * Note : Le middleware nettoiera automatiquement localStorage
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
     * Définit l'état de chargement
     *
     * @param action - Boolean indiquant si un chargement est en cours
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    /**
     * Définit une erreur
     *
     * @param action - Message d'erreur ou null pour effacer
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
        console.log("✅ [authSlice] Login réussi:", action.payload);

        state.loading = false;
        state.user = (action.payload.results as payloadDataUser).user ?? null;
        state.token =
          (action.payload.results as payloadDataToken).token ?? null;
        state.refreshToken =
          (action.payload.results as payloadDataRefreshToken).refreshToken ??
          null;
        state.isAuthenticated = true;
        state.error = null;

        // ✅ Le middleware sauvegardera automatiquement dans localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.error("❌ [authSlice] Login échoué:", action.payload);

        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;

        // ✅ Le middleware nettoiera automatiquement localStorage
      })

      // ==========================================
      // REGISTER USER
      // ==========================================
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        console.log("✅ [authSlice] Inscription réussie:", action.payload);

        state.loading = false;
        state.user = (action.payload as payloadDataUser).user ?? null;
        state.token = null; // Pas de token après inscription (doit se connecter)
        state.isAuthenticated = true;
        state.error = null;

        // ✅ Le middleware sauvegardera automatiquement dans localStorage
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.error("❌ [authSlice] Inscription échouée:", action.payload);

        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // ==========================================
      // FETCH CURRENT USER
      // Récupère l'utilisateur connecté actuel
      // ==========================================
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        console.log("✅ [authSlice] Utilisateur récupéré:", action.payload);

        state.loading = false;

        // Mettre à jour l'utilisateur si présent
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }

        // Mettre à jour le token si présent
        if (action.payload.token) {
          state.token = action.payload.token;
        }

        state.error = null;

        // ✅ Le middleware sauvegardera automatiquement dans localStorage
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        console.error(
          "❌ [authSlice] Échec récupération utilisateur:",
          action.payload
        );

        state.loading = false;
        state.error = action.payload || "Failed to fetch current user";
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;

        // ✅ Le middleware nettoiera automatiquement localStorage
      });
  },
});

// ============================================
// EXPORTS
// ============================================

/**
 * Actions exportées pour utilisation dans les composants
 *
 * Utilisations courantes :
 * - dispatch(setUser(newUser)) - Mettre à jour le profil
 * - dispatch(logout()) - Déconnecter l'utilisateur
 * - dispatch(setTokens({ token, refreshToken })) - Définir les tokens
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
 * Reducer par défaut pour le store Redux
 */
export default authSlice.reducer;

// ============================================
// EXEMPLES D'UTILISATION
// ============================================

/**
 * EXEMPLE 1 : Afficher l'utilisateur connecté
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
 * EXEMPLE 2 : Déconnexion
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
 * EXEMPLE 3 : Mettre à jour le profil
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
 * EXEMPLE 4 : Récupérer l'utilisateur au démarrage
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
