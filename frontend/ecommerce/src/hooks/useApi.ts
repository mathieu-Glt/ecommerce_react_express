import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { destroyTokenUser, refreshTokens } from "../services/api/auth";

// Variable to store the CSRF token
let csrfToken: string | null = null;
// Promise in progress to avoid multiple calls
let csrfTokenPromise: Promise<any> | null = null;

// Function to fetch the CSRF token
async function fetchCsrfToken(): Promise<any> {
  if (csrfTokenPromise) {
    return csrfTokenPromise;
  }

  csrfTokenPromise = (async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/csrf-token", {
        withCredentials: true,
      });

      csrfToken = response.data.csrfToken;

      return csrfToken;
    } catch (error) {
      csrfToken = null;
      throw error;
    } finally {
      csrfTokenPromise = null;
    }
  })();

  return csrfTokenPromise;
}
// ============================================
// CREATE A SINGLE GLOBAL INSTANCE
// ============================================
const BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000/api/";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// -----------------------------
// Request Interceptor
// -----------------------------
api.interceptors.request.use(
  async (config) => {
    config.headers = config.headers || {};

    // JWT
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // CSRF Token
    const needsCsrf = ["POST", "PUT", "DELETE", "PATCH"].includes(
      config.method?.toUpperCase() || ""
    );

    if (needsCsrf && !config.url?.includes("csrf-token")) {
      if (!csrfToken) {
        await fetchCsrfToken();
      }

      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }

    // Content-Type
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);
// -----------------------------
// Response Interceptor
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
          return api(originalRequest); // Use the global instance
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
          return api(originalRequest); // Use the global instance
        } catch (err) {
          return Promise.reject(error);
        }
      }
    }

    return Promise.reject(error);
  }
);

// ============================================
// EXPORT THE INSTANCE DIRECTLY
// ============================================
export { api, fetchCsrfToken };

// useApi always returns the same instance
export function useApi(): AxiosInstance {
  return api;
}
