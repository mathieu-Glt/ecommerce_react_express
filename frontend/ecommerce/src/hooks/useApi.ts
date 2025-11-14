import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { destroyTokenUser, refreshTokens } from "../services/api/auth";

// Variable pour stocker le token CSRF
let csrfToken: string | null = null;
// Promesse en cours pour éviter les appels multiples
let csrfTokenPromise: Promise<string> | null = null;

// Fonction pour récupérer le token CSRF
async function fetchCsrfToken(): Promise<string> {
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  if (csrfToken) {
    return csrfToken;
  }

  csrfTokenPromise = (async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/csrf-token", {
        withCredentials: true,
      });
      csrfToken = response.data.csrfToken;
      console.log("✅ CSRF token fetched:", csrfToken);
      return csrfToken;
    } catch (error) {
      console.error("❌ Failed to fetch CSRF token:", error);
      csrfToken = null;
      throw error;
    } finally {
      csrfTokenPromise = null;
    }
  })();

  return csrfTokenPromise;
}

// ============================================
// ✅ CRÉER UNE SEULE INSTANCE GLOBALE
// ============================================
const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000/api/";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// -----------------------------
// Intercepteur de requêtes
// -----------------------------
api.interceptors.request.use(
  async (config) => {
    console.log("🚀 Interceptor running for:", config.url);
    config.headers = config.headers || {};

    // JWT
    const token = localStorage.getItem("token");
    console.log(
      "🔐 Token from localStorage:",
      token ? "EXISTS (" + token.substring(0, 20) + "...)" : "NULL"
    );

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("✅ Authorization header set");
    } else {
      console.warn("⚠️ No token in localStorage!");
    }

    // CSRF Token
    if (!config.url?.includes("csrf-token")) {
      if (!csrfToken && !csrfTokenPromise) {
        console.log("📡 Fetching CSRF token...");
        await fetchCsrfToken();
      }
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
        console.log("✅ CSRF token set");
      }
    }

    // Content-Type
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    console.log("📤 Final headers:", {
      Authorization: config.headers["Authorization"] ? "SET" : "NOT SET",
      "X-CSRF-Token": config.headers["X-CSRF-Token"] ? "SET" : "NOT SET",
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// Intercepteur de réponses
// -----------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 -> refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const result: AxiosResponse = await refreshTokens();
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("refreshToken", result.data.refreshToken);

          originalRequest.headers["Authorization"] =
            "Bearer " + result.data.token;
          return api(originalRequest); // ✅ Utiliser l'instance globale
        } catch (err) {
          destroyTokenUser();
          window.location.href = "/";
        }
      } else {
        destroyTokenUser();
        window.location.href = "/";
      }
    }

    // 403 -> CSRF token invalide
    if (
      error.response?.status === 403 &&
      (error.response.data?.code === "EBADCSRFTOKEN" ||
        error.response.data?.message?.includes("csrf"))
    ) {
      if (!originalRequest._csrfRetry) {
        originalRequest._csrfRetry = true;

        try {
          csrfToken = null;
          csrfTokenPromise = null;
          await fetchCsrfToken();
          originalRequest.headers["X-CSRF-Token"] = csrfToken;
          return api(originalRequest); // ✅ Utiliser l'instance globale
        } catch (err) {
          console.error("❌ Failed to refresh CSRF token", err);
        }
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// ✅ EXPORTER L'INSTANCE DIRECTEMENT
// ============================================
export { api, fetchCsrfToken };

// ✅ useApi retourne toujours la même instance
export function useApi(): AxiosInstance {
  return api;
}
