/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  // ✅ SOLUTION : Configurer ts-jest pour accepter import.meta
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "esnext", // ✅ Permet import.meta
          target: "es2020",
          moduleResolution: "node",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          jsx: "react",
          skipLibCheck: true, // ✅ Ignore les erreurs dans node_modules
        },
        isolatedModules: true, // ✅ Plus rapide
      },
    ],
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/tests/__mocks__/fileMock.js",
  },

  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.test.tsx"],

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
  ],

  // ✅ Ignorer certains modules problématiques
  transformIgnorePatterns: ["node_modules/(?!(axios)/)"],

  // ✅ Mock import.meta globalement
  globals: {
    "import.meta": {
      env: {
        VITE_API_BASE_URL: "http://localhost:8000",
      },
    },
  },

  testTimeout: 10000,
  verbose: true,
};
