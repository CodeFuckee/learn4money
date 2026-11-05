/** 断点侦测（模块级单例，matchMedia 响应式监听窗口变化） */
import { ref } from "vue";

const BIG_SCREEN_QUERY = "(min-width: 1280px)";

const mql = window.matchMedia(BIG_SCREEN_QUERY);
const isBigScreen = ref(mql.matches);
mql.addEventListener("change", (e) => {
  isBigScreen.value = e.matches;
});

export function useBreakpoints() {
  return { isBigScreen };
}
