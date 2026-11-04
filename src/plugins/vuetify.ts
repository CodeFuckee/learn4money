/** Vuetify 实例：8 个命名主题（与 body[data-theme] CSS 层同名，由 useTheme 同步切换） */
import { createVuetify } from "vuetify";
import { PALETTES, THEME_NAMES } from "../lib/palette";

const themes = Object.fromEntries(
  THEME_NAMES.map((name) => {
    const p = PALETTES[name];
    return [
      name,
      {
        dark: p.dark,
        colors: {
          background: p.background,
          surface: p.surface,
          primary: p.primary,
          "on-primary": p.onPrimary,
          "on-surface": p.onSurface,
          "on-surface-variant": p.onSurfaceVariant,
          error: p.error,
        },
      },
    ];
  }),
);

export const vuetify = createVuetify({
  theme: {
    defaultTheme: "classic-dark",
    themes,
  },
});
