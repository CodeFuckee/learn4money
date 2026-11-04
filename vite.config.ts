import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// GitHub Pages 站点部署在仓库子路径：https://codefuckee.github.io/learn4money/
export default defineConfig({
  base: "/learn4money/",
  plugins: [vue(), vuetify({ autoImport: true })],
});
