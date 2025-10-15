import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // ✅ Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), "");

  // ✅ Retourner la configuration
  return {
    // Injecter VITE_API_BASE_URL dans process.env pour le navigateur
    define: {
      "process.env.VITE_API_BASE_URL": JSON.stringify(
        env.VITE_API_BASE_URL || "http://localhost:8000"
      ),
    },

    plugins: [react()],

    resolve: {
      dedupe: ["react", "react-dom"],
    },
  };
});
