<script setup lang="ts">
import { Palette } from "lucide-vue-next";
import { useTheme } from "../composables/useTheme";
import type { ThemeLang } from "../lib/types";

const { themeLang, THEME_LANGS, setThemeLang } = useTheme();

const LABELS: Record<ThemeLang, string> = {
  "": "经典",
  material: "Material",
  apple: "Apple",
  fluent: "Fluent",
};
</script>

<template>
  <div class="theme-bar">
    <span class="theme-label"><Palette class="ic ic-sm" />主题</span>
    <div class="theme-switch" id="themeSwitch" role="radiogroup" aria-label="界面主题">
      <button
        v-for="lang in THEME_LANGS"
        :key="lang"
        class="theme-btn"
        :class="{ active: themeLang === lang }"
        :data-theme="lang"
        @click="setThemeLang(lang)"
      >{{ LABELS[lang] }}</button>
    </div>
  </div>
</template>
