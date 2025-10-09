import axios from "axios";

const API_BASE = process.env.REACT_APP_API || "http://localhost:8000/api";

// publicApi : Instance axios publique (pas de token)
export const publicApi = axios.create({
  baseURL: API_BASE,
});

// privateApi : Instance axios privée (avec token auto)
export const privateApi = axios.create({
  baseURL: API_BASE,
});

// Intercepteur pour ajouter automatiquement le token à chaque requête
privateApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs globales (401, 500, etc.) pour les requêtes privées
privateApi.interceptors.response.use(
  (response) => {
    // renvoie directement data au lieu de toute la réponse Axios
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn("⛔ No authorized - token expired or invalid");

        localStorage.removeItem("token");
        window.location.href = "/login";
      }

      if (status >= 500) {
        console.error(
          "🔥 Erreur serveur :",
          error.response.data.message || "Erreur serveur"
        );
      }
    } else {
      console.error("🌐 Network error :", error.message);
    }

    return Promise.reject(error);
  }
);

// Intercepteur pour publicApi - retourne directement data
publicApi.interceptors.response.use(
  (response) => {
    console.log("publicApi response :", response);
    // renvoie directement data au lieu de toute la réponse Axios
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status >= 500) {
        console.error(
          "🔥 Server error :",
          error.response.data.message || "Server error"
        );
      }
    } else {
      console.error("🌐 Network error :", error.message);
    }

    return Promise.reject(error);
  }
);
