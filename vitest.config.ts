/// <reference types="vitest" />

import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from "@vitejs/plugin-react-swc";

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    include: [
      "./src/**/*.spec.tsx",
      "./src/**/*.spec.ts",
      "./functions/**/*.spec.ts",
      "./common/**/*.spec.ts",
    ],
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
  },
});
