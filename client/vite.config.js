import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: process.env.SERVER,
        secure: false,
        changeOrigin: true,
      },
    },
    host: "0.0.0.0",
    port: 5173,
  },
  plugins: [react()],
});
