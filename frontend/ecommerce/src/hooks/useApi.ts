import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
import { destroyTokenUser, refreshTokens } from "../services/api/auth";

export function useApi(): AxiosInstance {
  // Instance en commentaire pour les tests unitaires
  // (car jest ne supporte pas import.meta.env)
  // Il faut donc définir la variable d'environnement BASE_URL
  // dans le fichier .env.test à la racine du projet
  // et utiliser cette instance dans les tests unitaires

  // const api: AxiosInstance = axios.create({
  //   baseURL: import.meta.env.VITE_API_BASE_URL,
  //   withCredentials: true,
  // });

  const BASE_URL =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL
      ? import.meta.env.VITE_API_BASE_URL
      : "http://localhost:5173";

  const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
  });

  // interceptor pour injection token
  api.interceptors.request.use(
    (config) => {
      // ✅ Logique pour gérer FormData vs JSON
      const token: string | null = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
        console.log(
          "🚀 ~ file: useApi.ts:17 ~ api.interceptors.config.use ~ token:",
          token
        );
      }

      // ✅ IMPORTANT : Définir Content-Type seulement si ce n'est PAS un FormData
      if (!(config.data instanceof FormData)) {
        config.headers["Content-Type"] = "application/json";
      }
      // Si c'est un FormData, axios gérera automatiquement le Content-Type avec boundary

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // interceptor response API
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      if (error.response && error.response.status === 401) {
        const originalRequest = error.config;
        if (!originalRequest._retry) {
          // pour éviter boucle infinie du refreshToken
          originalRequest._retry = true;
        }
        // récupérer le refreshToken localStorage
        const refreshToken: string | null =
          localStorage.getItem("refreshToken");
        //appeler la requete du refreshToken
        if (refreshToken) {
          try {
            const result: AxiosResponse = await refreshTokens();
            console.log("Bonjour REACT");
            localStorage.setItem("accessToken", result?.data.datas.accessToken);
            localStorage.setItem(
              "refreshToken",
              result?.data.datas.refreshToken
            );
            originalRequest.headers["Authorization"] =
              "Bearer " + result?.data.datas.accessToken;
            return axios(originalRequest);
          } catch (error) {
            destroyTokenUser();
            window.location.href = "/";
          }
        } else {
          // supprimer le token et le refresh
          destroyTokenUser();
          window.location.href = "/";
        }
      }
      return Promise.reject(error);
    }
  );
  return api;
}
