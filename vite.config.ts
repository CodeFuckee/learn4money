import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

/** @carbon/vue 3.x 渲染旧类前缀 bx--，而 @carbon/styles 1.x 编译产物是 cds--。
 *  构建时把 CSS 类前缀改回 bx-- 以匹配组件（token 变量 --cds- 不受影响）。 */
function carbonPrefixFix(): Plugin {
  return {
    name: "carbon-prefix-fix",
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === "asset" && file.fileName.endsWith(".css")) {
          file.source = String(file.source).replaceAll("cds--", "bx--");
        }
      }
    },
  };
}

// GitHub Pages 站点部署在仓库子路径：https://codefuckee.github.io/learn4money/
export default defineConfig({
  base: "/learn4money/",
  plugins: [vue(), vuetify({ autoImport: true }), carbonPrefixFix()],
});
