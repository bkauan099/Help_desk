import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Base relativa facilita publicar no GitHub Pages (subdiretório do repositório).
export default defineConfig({
  plugins: [react()],
  base: "./",
});
