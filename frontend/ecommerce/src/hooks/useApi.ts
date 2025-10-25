import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { destroyTokenUser, refreshTokens } from "../services/api/auth";

export function useApi(): AxiosInstance {
  const BASE_URL =
    import.meta.env?.VITE_API_BASE_URL || "http://localhost:8000/api/";

  const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // Intercepteur de requêtes
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
        console.log("🔐 Token added to request:", token);
      }

      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Intercepteur de réponses
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        const originalRequest = error.config;

        if (!originalRequest._retry) {
          originalRequest._retry = true;
        }

        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            const result: AxiosResponse = await refreshTokens();

            localStorage.setItem("token", result.data.token);
            localStorage.setItem("refreshToken", result.data.refreshToken);

            originalRequest.headers["Authorization"] =
              "Bearer " + result.data.token;

            return axios(originalRequest);
          } catch (err) {
            destroyTokenUser();
            window.location.href = "/";
          }
        } else {
          destroyTokenUser();
          window.location.href = "/";
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}
