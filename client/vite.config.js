import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "build",
    rollupOptions: {
      output: {
        entryFileNames: "static/js/[name].[hash].js",
        chunkFileNames: "static/js/[name].[hash].js",
        assetFileNames: ({ name }) => {
          if (/\.(css)$/.test(name ?? "")) {
            return "static/css/[name].[hash].[ext]";
          }
          if (/\.(png|jpe?g|gif|svg)$/.test(name ?? "")) {
            return "static/media/[name].[hash].[ext]";
          }
          return "static/[name].[hash].[ext]";
        },
      },
    },
  },
});
