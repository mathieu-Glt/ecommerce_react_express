import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), "");

  // Retourner la configuration
  return {
    // Injecter VITE_API_BASE_URL dans process.env pour le navigateur
    define: {
      "process.env.VITE_API_BASE_URL": JSON.stringify(
        env.VITE_API_BASE_URL || "http://localhost:8000"
      ),
    },
    // build: {
    //   // Ignorer les erreurs TypeScript pendant le build
    //   rollupOptions: {
    //     onwarn(warning, warn) {
    //       // Ignorer les warnings
    //       if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
    //       warn(warning);
    //     },
    //   },
    // },
    // // Désactiver la vérification TypeScript
    // esbuild: {
    //   logOverride: { "this-is-undefined-in-esm": "silent" },
    // },

    plugins: [react()],

    resolve: {
      dedupe: ["react", "react-dom"],
    },
  };
});
