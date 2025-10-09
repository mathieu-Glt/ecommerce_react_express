import {
  loginWithEmail as loginWithEmailAPI,
  register as registerAPI,
  currentUser as currentUserAPI,
  updateUserProfile as updateUserProfileAPI,
  loginWithGoogle,
  fetchGoogleUser,
  loginWithAzure,
} from "../api";
import { connectSocket, disconnectSocket, getSocket } from "../socket/socket";
import axios from "axios";
export const loginWithEmailAction = (email, password) => async (dispatch) => {
  console.log("loginWithEmailAction :", email, password);
  dispatch({ type: "LOGIN_START" });
  try {
    const response = await loginWithEmailAPI(email, password);
    console.log("loginWithEmailAction response :", response);

    // Gérer différentes structures de réponse possibles
    let userData, tokenData;

    if (response.data) {
      // Si la réponse est dans response.data
      userData = response.data.user || response.data;
      tokenData = response.data.token || response.data.accessToken;
    } else {
      // Si la réponse est directement dans response
      userData = response.user || response;
      tokenData =
        response.token || response.data?.token || response.accessToken;
    }

    // Vérifier que nous avons les données utilisateur
    if (!userData) {
      throw new Error("Données utilisateur manquantes dans la réponse");
    }

    // Si pas de token dans la réponse, on peut continuer sans token pour l'instant
    // Le token sera géré par le serveur via les cookies ou sessions
    if (!tokenData) {
      console.warn(
        "Token manquant dans la réponse, utilisation d'un token temporaire"
      );
      tokenData = "temp_token_" + Date.now(); // Token temporaire
    }

    // Dispatch success avec les données utilisateur et token
    dispatch({
      type: "LOGIN_SUCCESS",
      payload: {
        user: userData,
        token: tokenData,
      },
    });

    // Émission Socket.IO côté client
    const socket = getSocket();

    socket.on("user:connected", {
      user: userData,
      token: tokenData,
    });

    return { success: true, data: { user: userData, token: tokenData } };
  } catch (err) {
    console.error("Login error:", err);
    dispatch({
      type: "LOGIN_ERROR",
      payload: err.response?.data?.message || err.message,
    });
    throw err;
  }
};

// Login with Google
export const loginWithGoogleAction = () => async (dispatch) => {
  dispatch({ type: "LOGIN_START" });

  try {
    loginWithGoogle(); // redirection, pas de résultat direct
    dispatch({
      type: "LOGIN_REDIRECTING",
      payload: "Redirection to Google authentication...",
    });
  } catch (err) {
    dispatch({
      type: "LOGIN_ERROR",
      payload: err.message,
    });
  }
};

// login with Azure AD
export const loginWithAzureAction = () => async (dispatch) => {
  dispatch({ type: "LOGIN_START" });

  try {
    loginWithAzure();
    dispatch({
      type: "LOGIN_REDIRECTING",
      payload: "Redirection to Azure AD authentication...",
    });
  } catch (err) {
    dispatch({
      type: "LOGIN_ERROR",
      payload: err.message,
    });
  }
};

// Get current logged-in user from session (after Google login or page reload)
// authActions.js

export const fetchCurrentUser = () => async (dispatch) => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenUrl = urlParams.get("token");
    const refreshToken = urlParams.get("refreshToken");
    const authSuccess = urlParams.get("auth");

    // Nettoyage URL après récupération des paramètres
    if (tokenUrl || authSuccess) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    if (tokenUrl && refreshToken) {
      console.log("Tokens trouvés dans l'URL");
      localStorage.setItem("token", tokenUrl);
      localStorage.setItem("refreshToken", refreshToken);
    }

    const localToken = localStorage.getItem("token");
    let res;

    if (localToken) {
      res = await axios.get("http://localhost:8000/api/auth/me", {
        headers: { Authorization: `Bearer ${localToken}` },
        withCredentials: true,
      });
    } else {
      res = await axios.get("http://localhost:8000/api/auth/me", {
        withCredentials: true,
      });
    }

    const user = res.data.user;
    const token = res.data.token || localToken || "";

    if (res.status === 200 && user) {
      console.log("fetchCurrentUser success:", user.id);

      // Connexion Socket.IO APRÈS authentification réussie
      const socket = connectSocket();

      // Configuration des listeners Socket.IO
      const setupSocketListeners = () => {
        // Authentification réussie
        socket.on(
          "auth:success",
          ({ user, token, refreshToken, timestamp }) => {
            console.log("📡 Auth success via Socket.IO:", user.id);
            console.log("📡 Auth success via Socket.IO:", user);

            // Mise à jour des tokens si plus récents
            if (token && refreshToken) {
              localStorage.setItem("token", token);
              localStorage.setItem("refreshToken", refreshToken);
            }

            dispatch({
              type: "GET_CURRENT_USER_SUCCESS",
              payload: { user, token },
            });
          }
        );

        // Utilisateur connecté
        // socket.on(
        //   "user:connected",
        //   ({ user, token, refreshToken, socketId }) => {
        //     console.log(
        //       "User connected via Socket.IO:",
        //       user,
        //       "Socket:",
        //       socketId
        //     );

        //     dispatch({
        //       type: "SOCKET_CONNECTED",
        //       payload: { socketId, connected: true },
        //     });
        //   }
        // );

        // Session expirée
        // socket.on("session:expired", () => {
        //   console.log("Session expirée");
        //   dispatch(logout());
        // });

        // Token rafraîchi
        // socket.on("token:refreshed", ({ token }) => {
        //   console.log("Token rafraîchi via Socket.IO");
        //   localStorage.setItem("token", token);
        //   dispatch({
        //     type: "TOKEN_REFRESHED",
        //     payload: { token },
        //   });
        // });

        // Authentification requise
        // socket.on("auth:required", () => {
        //   console.log("Authentification requise");
        //   dispatch(logout());
        // });

        // // Déconnexion
        // socket.on("user:logged_out", () => {
        //   console.log("Déconnecté par le serveur");
        //   dispatch(logout());
        // });

        // Heartbeat pour maintenir la connexion
        const heartbeatInterval = setInterval(() => {
          if (socket.connected) {
            socket.emit("user:heartbeat");
          }
        }, 30000);

        // socket.on("user:heartbeat:ack", ({ timestamp }) => {
        //   console.log(
        //     "Heartbeat OK:",
        //     new Date(timestamp).toLocaleTimeString()
        //   );
        // });

        // Nettoyage à la déconnexion
        // socket.on("disconnect", () => {
        //   clearInterval(heartbeatInterval);
        //   dispatch({
        //     type: "SOCKET_DISCONNECTED",
        //     payload: { connected: false },
        //   });
        // });
      };

      // Setup listeners si pas déjà fait
      // if (!socket.hasListeners) {
      //   setupSocketListeners();
      //   socket.hasListeners = true;
      // }

      // Mise à jour Redux
      dispatch({
        type: "GET_CURRENT_USER_SUCCESS",
        payload: { user, token },
      });

      return { success: true, data: { user, token } };
    }

    throw new Error("Utilisateur non trouvé");
  } catch (err) {
    console.error("fetchCurrentUser error:", err);

    dispatch({
      type: "GET_CURRENT_USER_ERROR",
      payload: err.response?.data?.message || err.message,
    });

    dispatch({ type: "SET_USER", payload: null });

    // Déconnexion socket en cas d'erreur d'auth
    disconnectSocket();

    return { success: false, error: err };
  }
};
// call after login with google
export const callAfterLoginWithGoogleAction = () => async (dispatch) => {
  const result = await fetchGoogleUser();
  console.log("callAfterLoginWithGoogleAction result :", result);
  dispatch({
    type: "LOGIN_SUCCESS",
    payload: {
      user: result.user,
      token: result.token,
    },
  });
  return { success: true, data: result };
};

// Register
export const registerAction = (userData) => async (dispatch) => {
  dispatch({ type: "REGISTER_START" });
  try {
    const response = await registerAPI(userData);
    console.log("Register API Response:", response); // Debug

    // Gérer différentes structures de réponse possibles
    let userDataResponse, tokenData;

    if (response.data) {
      // Si la réponse est dans response.data
      userDataResponse = response.data.user || response.data;
      tokenData = response.data.token || response.data.accessToken;
    } else {
      // Si la réponse est directement dans response
      userDataResponse = response.user || response;
      tokenData = response.token || response.accessToken;
    }

    // Vérifier que nous avons les données utilisateur
    if (!userDataResponse) {
      throw new Error("Données utilisateur manquantes dans la réponse");
    }

    // Si pas de token dans la réponse, on peut continuer sans token pour l'instant
    if (!tokenData) {
      console.warn(
        "Token manquant dans la réponse, utilisation d'un token temporaire"
      );
      tokenData = "temp_token_" + Date.now(); // Token temporaire
    }

    // Dispatch success avec les données utilisateur et token
    dispatch({
      type: "REGISTER_SUCCESS",
      payload: {
        user: userDataResponse,
        token: tokenData,
      },
    });

    // Synchroniser avec localStorage et sessionStorage

    return {
      success: true,
      data: { user: userDataResponse, token: tokenData },
    };
  } catch (err) {
    console.error("Register error:", err);
    dispatch({
      type: "REGISTER_ERROR",
      payload: err.response?.data?.message || err.message,
    });
    throw err;
  }
};

// Get current user
// export const getCurrentUserAction = (token) => async (dispatch) => {
//   dispatch({ type: "GET_CURRENT_USER_START" });
//   try {
//     const { data } = await currentUserAPI(token);

//     dispatch({
//       type: "GET_CURRENT_USER_SUCCESS",
//       payload: { user: data.user },
//     });

//     return { success: true, data };
//   } catch (err) {
//     dispatch({
//       type: "GET_CURRENT_USER_ERROR",
//       payload: err.response?.data?.message || err.message,
//     });
//     throw err;
//   }
// };

// Update user profile
export const updateUserProfileAction =
  (userData, token) => async (dispatch) => {
    dispatch({ type: "UPDATE_PROFILE_START" });
    try {
      const { data } = await updateUserProfileAPI(userData, token);

      dispatch({
        type: "UPDATE_PROFILE_SUCCESS",
        payload: { user: data.user },
      });

      // Mettre à jour localStorage et sessionStorage
      const currentUser = JSON.parse(
        localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"
      );
      const updatedUser = { ...currentUser, ...data.user };

      return { success: true, data };
    } catch (err) {
      dispatch({
        type: "UPDATE_PROFILE_ERROR",
        payload: err.response?.data?.message || err.message,
      });
      throw err;
    }
  };

// Logout
export const logout = () => (dispatch) => {
  const socket = getSocket();

  if (socket?.connected) {
    socket.emit("user:logout");
  }

  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");

  disconnectSocket();

  dispatch({ type: "LOGOUT" });
  dispatch({ type: "SET_USER", payload: null });

  window.location.href = "/login";
};
// Clear auth errors
export const clearAuthErrors = () => (dispatch) => {
  dispatch({ type: "CLEAR_AUTH_ERRORS" });
};
