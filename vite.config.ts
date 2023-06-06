// <reference types="vite" />

import * as fs from "node:fs/promises";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { NormalizedOutputOptions, OutputBundle, Plugin } from "rollup";

function earlyHints(): Plugin {
  return {
    name: "transform-file",

    async writeBundle(src: NormalizedOutputOptions, a: OutputBundle) {
      const files = Object.keys(a);
      const editorFile = files.find((file) => file.includes("Editor-"));
      const cssFile = files.find((file) => file.includes(".css"));
      const fileName = `${src.dir}/_headers`;
      const content = `
/edit/*
  Link: </${editorFile}>; rel=preload; as=script
/*
  Link: </${cssFile}>; rel=preload; as=style
            `;
      await fs.writeFile(fileName, content);
      console.log(src.dir);
      console.log("generateBundle", Object.keys(a));
    },
  };
}

// https://vitejs.dev/config/
// eslint-disable-next-line import/no-unused-modules
export default defineConfig({
  plugins: [tsconfigPaths(), react(), earlyHints()],
});
