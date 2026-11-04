<script setup lang="ts">
import { Palette, Sun, Moon } from "lucide-vue-next";
import { CvButton } from "@carbon/vue";
import { useTheme } from "../../composables/useTheme";
import type { ThemeLang } from "../../lib/types";

const { themeLang, themeMode, THEME_LANGS, setThemeLang, toggleThemeMode } = useTheme();

const LABELS: Record<ThemeLang, string> = {
  classic: "经典",
  material: "Material",
  apple: "Apple",
  fluent: "Fluent",
};
</script>

<template>
  <div class="theme-bar">
    <span class="theme-label"><Palette class="ic ic-sm" />主题</span>
    <div class="theme-switch carbon" id="themeSwitch" role="group" aria-label="界面主题">
      <CvButton
        v-for="lang in THEME_LANGS"
        :key="lang"
        size="small"
        :kind="themeLang === lang ? 'primary' : 'tertiary'"
        :data-theme="lang"
        @click="setThemeLang(lang)"
      >{{ LABELS[lang] }}</CvButton>
    </div>
    <CvButton
      id="themeModeToggle"
      size="small"
      kind="tertiary"
      :title="themeMode === 'dark' ? '切换到浅色' : '切换到深色'"
      :aria-label="themeMode === 'dark' ? '切换到浅色' : '切换到深色'"
      @click="toggleThemeMode"
    >
      <Sun v-if="themeMode === 'dark'" class="ic ic-sm" />
      <Moon v-else class="ic ic-sm" />
    </CvButton>
  </div>
</template>
