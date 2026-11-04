<script setup lang="ts">
import { Palette, Sun, Moon } from "lucide-vue-next";
import { useTheme } from "../composables/useTheme";
import type { ThemeLang } from "../lib/types";

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
    <v-btn-toggle
      id="themeSwitch"
      class="theme-switch"
      :model-value="themeLang"
      mandatory
      color="primary"
      aria-label="界面主题"
      @update:model-value="setThemeLang($event as ThemeLang)"
    >
      <v-btn
        v-for="lang in THEME_LANGS"
        :key="lang"
        :value="lang"
        :data-theme="lang"
        size="small"
      >{{ LABELS[lang] }}</v-btn>
    </v-btn-toggle>
    <v-btn
      id="themeModeToggle"
      class="mode-toggle"
      icon
      variant="tonal"
      color="primary"
      size="small"
      :title="themeMode === 'dark' ? '切换到浅色' : '切换到深色'"
      :aria-label="themeMode === 'dark' ? '切换到浅色' : '切换到深色'"
      @click="toggleThemeMode"
    >
      <Sun v-if="themeMode === 'dark'" class="ic ic-sm" />
      <Moon v-else class="ic ic-sm" />
    </v-btn>
  </div>
</template>
