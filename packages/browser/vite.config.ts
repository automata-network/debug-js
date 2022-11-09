import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "DebugJS",
      formats: ["es", "iife"],
      fileName: "index",
    },
  },
  plugins: [
    dts({
      tsConfigFilePath: "tsconfig.release.json",
      insertTypesEntry: true,
      noEmitOnError: true,
      skipDiagnostics: false,
      logDiagnostics: true,
    }),
  ],
});
