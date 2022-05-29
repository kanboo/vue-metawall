import { fileURLToPath, URL } from "url";

import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },

    /**
     * How to proxy Vite's HMR request in Docker?
     * https://stackoverflow.com/questions/71050909/how-to-proxy-vites-hmr-request-in-docker
     */
    server: {
      /**
       * How to expose 'host' for external device display?
       * https://github.com/vitejs/vite/discussions/3396
       * https://cn.vitejs.dev/config/#server-host
       */
      host: true,

      /**
       * 預設是 3000 Port
       * 若是使用 Docker-compose 啟動的話，
       * 視狀態啟動的 Port 可能會不同再調整。
       */
      // port: 3000,

      /**
       * 是否啟動 HTTPS
       */
      // https: true,

      /**
       * 熱更新(https://cn.vitejs.dev/config/#server-hmr)
       * 預設是 3000 Port
       * 若是使用 Docker-compose 啟動的話，
       * 要看 Nginx 最終曝露的 Port 是什麼，用於對應 HMR(熱更新) 的 Port。
       */
      // hmr: {
      //   clientPort: 3000,
      // },
    },
  };
});
