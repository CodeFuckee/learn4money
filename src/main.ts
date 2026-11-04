import { createApp } from "vue";
import "./styles/base.css";
import "./styles/themes.css";
// 先应用已持久化的主题，再挂载，避免首帧闪烁
import "./composables/useTheme";
import App from "./App.vue";

createApp(App).mount("#app");
