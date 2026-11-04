import { createApp } from "vue";
// IBM Carbon 官方组件样式（bx-- 前缀，与 @carbon/vue 3 渲染的类名匹配）
import "carbon-components/index.scss";
import "./styles/base.css";
import "./styles/themes.css";
// 先应用已持久化的主题，再挂载，避免首帧闪烁
import "./composables/useTheme";
import { vuetify } from "./plugins/vuetify";
import App from "./App.vue";

createApp(App).use(vuetify).mount("#app");
