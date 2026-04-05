import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite 6 + Tailwind v4: tailwindcss() must come BEFORE react() so CSS is processed correctly.
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
});
