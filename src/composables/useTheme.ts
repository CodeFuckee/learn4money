/** 主题管理：设计语言（经典/Material/Apple/Fluent） × 深/浅模式 = 8 套主题
 *
 * 同步驱动两套主题载体：
 * - Vuetify 命名主题（组件颜色 tokens）
 * - body[data-theme]（themes.css 的形状/字体/自绘元素覆盖）
 * 主题名统一为 `${lang}-${mode}`（如 material-light），偏好持久化到 localStorage。
 */
import { ref, watch } from "vue";
import { loadJSON, saveJSON } from "../lib/storage";
import { themeName } from "../lib/palette";
import type { ThemeLang, ThemeMode } from "../lib/types";
import { vuetify } from "../plugins/vuetify";

const KEYS = { lang: "l4m.themeLang", mode: "l4m.themeMode" } as const;

const THEME_LANGS: ThemeLang[] = ["classic", "material", "apple", "fluent"];

function normalizeLang(v: unknown): ThemeLang {
  return THEME_LANGS.includes(v as ThemeLang) ? (v as ThemeLang) : "classic";
}

function normalizeMode(v: unknown): ThemeMode {
  return v === "light" ? "light" : "dark";
}

const themeLang = ref<ThemeLang>(normalizeLang(loadJSON<ThemeLang>(KEYS.lang, "classic")));
const themeMode = ref<ThemeMode>(normalizeMode(loadJSON<ThemeMode>(KEYS.mode, "dark")));

function applyTheme(): void {
  const name = themeName(themeLang.value, themeMode.value);
  vuetify.theme.global.name.value = name;
  document.body.dataset.theme = name;
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
