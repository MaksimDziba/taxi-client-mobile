import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import Components from "unplugin-vue-components/vite";
import ViteComponents, {
  AntDesignVueResolver,
} from "unplugin-vue-components/resolvers";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  base: mode === "development" ? "" : path.resolve(__dirname, "./dist/"),
  devServer: {
    proxy: "localhost:8000",
  },
  plugins: [
    vue(),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
}));
