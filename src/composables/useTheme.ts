/** 主题管理：设计语言（经典/Material/Apple/Fluent） × 深/浅模式
 *
 * body[data-theme] 值：经典深 = 无属性，其余为 `${lang}` 或 `${lang}-light`。
 * 选择持久化到 localStorage，刷新保持。
 */
import { ref, watch } from "vue";
import { loadJSON, saveJSON } from "../lib/storage";
import type { ThemeLang, ThemeMode } from "../lib/types";

const KEYS = { lang: "l4m.themeLang", mode: "l4m.themeMode" } as const;

const THEME_LANGS: ThemeLang[] = ["", "material", "apple", "fluent"];

const themeLang = ref<ThemeLang>(loadJSON<ThemeLang>(KEYS.lang, ""));
const themeMode = ref<ThemeMode>(loadJSON<ThemeMode>(KEYS.mode, "dark"));

function dataThemeValue(lang: ThemeLang, mode: ThemeMode): string {
  if (!lang) return mode === "light" ? "classic-light" : "";
  return mode === "light" ? `${lang}-light` : lang;
}

function applyTheme(): void {
  const v = dataThemeValue(themeLang.value, themeMode.value);
  if (v) document.body.dataset.theme = v;
  else delete document.body.dataset.theme;
}

function setThemeLang(lang: ThemeLang): void {
  if (THEME_LANGS.includes(lang)) themeLang.value = lang;
}

function toggleThemeMode(): void {
  themeMode.value = themeMode.value === "dark" ? "light" : "dark";
}

watch([themeLang, themeMode], ([lang, mode]) => {
  saveJSON(KEYS.lang, lang);
  saveJSON(KEYS.mode, mode);
  applyTheme();
});

// 模块加载即应用（入口 main.ts import 时生效）
applyTheme();

export function useTheme() {
  return { themeLang, themeMode, THEME_LANGS, setThemeLang, toggleThemeMode };
}
