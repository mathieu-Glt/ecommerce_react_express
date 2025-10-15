// tests/setup.ts
// Ce fichier est exécuté AVANT tous les tests

// ✅ Mock de import.meta pour tous les tests
Object.defineProperty(globalThis, "import", {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: "http://localhost:8000", // URL de test
        // Ajouter d'autres variables d'environnement si nécessaire
      },
    },
  },
  writable: true,
  configurable: true,
});

// ✅ Mock de localStorage (souvent nécessaire pour les tests)
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
  writable: true,
});

// ✅ Reset localStorage avant chaque test
beforeEach(() => {
  localStorage.clear();
});

// ✅ Console logs pour confirmer que le setup fonctionne
console.log("✅ Test setup completed");
console.log(
  "📝 import.meta.env.VITE_API_BASE_URL:",
  (globalThis as any).import?.meta?.env?.VITE_API_BASE_URL
);
