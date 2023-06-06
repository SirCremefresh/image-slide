import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { earlyHints } from "pages-vite-early-hints-plugin";

// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    earlyHints({
      hints: [
        {
          name: "Editor",
          type: "js",
          path: "/edit/*",
        },
        {
          name: "index",
          type: "css",
          path: "/*",
        },
      ],
    }),
  ],
});
