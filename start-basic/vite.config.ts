import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({ 
      customViteReactPlugin: true,
      tsr: {
        routesDirectory: "./src/app/routes",
        generatedRouteTree: "./src/routeTree.gen.ts",
      }
    }),
    viteReact(),
  ],
});
