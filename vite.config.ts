import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [mkcert(), vue()],
});
