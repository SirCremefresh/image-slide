/// <reference types="vitest" />

import { defineConfig } from "vite";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  test: {
    globals: true,
    environment: "happy-dom",
  },
});
