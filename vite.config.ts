// <reference types="vite" />

import * as fs from "node:fs/promises";
import * as path from "node:path";
import { PluginOption, defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { NormalizedOutputOptions, OutputBundle } from "rollup";

type FileEnding = "css" | "js";
type FileType = "style" | "script";

function fileEndingToType(fileEnding: FileEnding): FileType {
  switch (fileEnding) {
    case "css":
      return "style";
    case "js":
      return "script";
  }
}

function earlyHints(
  options: { type: FileEnding; name: string; path: string }[]
): PluginOption {
  return {
    name: "early-hints",
    apply: "build",

    async writeBundle(
      outputOptions: NormalizedOutputOptions,
      bundle: OutputBundle
    ): Promise<void> {
      const files = Object.keys(bundle);
      let out = "";
      for (const option of options) {
        const fileName = files.find(
          (file) =>
            file.startsWith(path.join("assets", option.name)) &&
            file.endsWith(option.type)
        );
        if (!fileName) {
          throw new Error(
            `File not found. name: ${option.name}, type: ${
              option.type
            }, availableFiles: ${JSON.stringify(files)}`
          );
        }
        out += `${option.path}
  Link: </${fileName}>; rel=preload; as=${fileEndingToType(option.type)}\n`;
      }
      const headersFileName = path.join(outputOptions.dir, "_headers");
      await fs.writeFile(headersFileName, out);
    },
  };
}

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),
    earlyHints([
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
    ]),
  ],
});
