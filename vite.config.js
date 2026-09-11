import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // Set to your deployment subpath if needed, e.g., "/my-app/"
  plugins: [
    react({
      include: ["**/*.jsx", "**/*.js"],
    }),
  ],
});   