import { fileURLToPath, URL } from "url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    base: "./",
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      proxy: {
        "/api": {
          // eslint-disable-next-line no-undef
          target: `${process.env.VITE_BACKEND_HOST || "http://localhost:3005/"
            }/`, // 遠端 URL Domain
          changeOrigin: true,
        },
      },
    },
  };
});
