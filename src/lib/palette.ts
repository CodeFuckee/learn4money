/** 8 套主题的色板（单一事实源）
 *
 * 主题名 = `${设计语言}-${深/浅}`；Vuetify 命名主题与 body[data-theme] CSS 层共用此命名。
 * 强调色统一为蓝色系，取各设计语言的官方蓝。
 */
import type { ThemeLang, ThemeMode } from "./types";

export type ThemeName =
  | "classic-dark"
  | "classic-light"
  | "material-dark"
  | "material-light"
  | "apple-dark"
  | "apple-light"
  | "fluent-dark"
  | "fluent-light";

export function themeName(lang: ThemeLang, mode: ThemeMode): ThemeName {
  return `${lang}-${mode}` as ThemeName;
}

export interface ThemePalette {
  dark: boolean;
  /** 页面背景 */
  background: string;
  /** 卡片表面 */
  surface: string;
  /** 强调色（统一蓝） */
  primary: string;
  /** 强调色上的文字 */
  onPrimary: string;
  /** 页面正文文字 */
  onSurface: string;
  /** 次级文字 */
  onSurfaceVariant: string;
  error: string;
}

export const THEME_NAMES: ThemeName[] = [
  "classic-dark",
  "classic-light",
  "material-dark",
  "material-light",
  "apple-dark",
  "apple-light",
  "fluent-dark",
  "fluent-light",
];

export const PALETTES: Record<ThemeName, ThemePalette> = {
  /* 经典：黑白配色（深色白 accent / 浅色黑 accent） */
  "classic-dark": {
    dark: true,
    background: "#0a0a0a",
    surface: "#1a1a1a",
    primary: "#ffffff",
    onPrimary: "#0a0a0a",
    onSurface: "#f4f4f4",
    onSurfaceVariant: "#8d8d8d",
    error: "#8d8d8d",
  },
  "classic-light": {
    dark: false,
    background: "#f4f4f4",
    surface: "#ffffff",
    primary: "#161616",
    onPrimary: "#ffffff",
    onSurface: "#161616",
    onSurfaceVariant: "#6f6f6f",
    error: "#6f6f6f",
  },
  /* Material Design 3：蓝种子调色板（dark primary = tone80，light primary = tone40） */
  "material-dark": {
    dark: true,
    background: "#141218",
    surface: "#1d1b20",
    primary: "#a5c8ff",
    onPrimary: "#00315f",
    onSurface: "#e6e0e9",
    onSurfaceVariant: "#948f99",
    error: "#f2b8b5",
  },
  "material-light": {
    dark: false,
    background: "#fef7ff",
    surface: "#f3edf7",
    primary: "#0061a4",
    onPrimary: "#ffffff",
    onSurface: "#1d1b20",
    onSurfaceVariant: "#49454f",
    error: "#b3261e",
  },
  /* Apple：iOS systemBlue（dark #0A84FF / light #007AFF） */
  "apple-dark": {
    dark: true,
    background: "#000000",
    surface: "#1c1c1e",
    primary: "#0a84ff",
    onPrimary: "#ffffff",
    onSurface: "#f2f2f7",
    onSurfaceVariant: "#8e8e93",
    error: "#ff453a",
  },
  "apple-light": {
    dark: false,
    background: "#f2f2f7",
    surface: "#ffffff",
    primary: "#007aff",
    onPrimary: "#ffffff",
    onSurface: "#000000",
    onSurfaceVariant: "#8a8a8e",
    error: "#ff3b30",
  },
  /* Fluent：Windows 11 系统 accent（dark #4CC2FF / light #005FB8） */
  "fluent-dark": {
    dark: true,
    background: "#202020",
    surface: "#2b2b2b",
    primary: "#4cc2ff",
    onPrimary: "#002a3f",
    onSurface: "#ffffff",
    onSurfaceVariant: "#9d9d9d",
    error: "#ff99a4",
  },
  "fluent-light": {
    dark: false,
    background: "#f3f3f3",
    surface: "#ffffff",
    primary: "#005fb8",
    onPrimary: "#ffffff",
    onSurface: "#1b1b1b",
    onSurfaceVariant: "#5d5d5d",
    error: "#c42b1c",
  },
};
