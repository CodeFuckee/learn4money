<script setup lang="ts">
import { computed } from "vue";
import { Wallet } from "lucide-vue-next";
import { useTimer } from "../composables/useTimer";
import GenderPicker from "./GenderPicker.vue";

const { settings, hourlyWage, perSecond, session } = useTimer();

const locked = computed(() => !!session.value);

function setMode(mode: unknown): void {
  if (locked.value) return;
  if (mode === "monthly" || mode === "hourly") settings.mode = mode;
}

const wageShown = computed(() =>
  settings.mode === "monthly" ? settings.monthly || "" : settings.hourly || "",
);

const rateHint = computed(() =>
  hourlyWage.value > 0
    ? `折算时薪：${hourlyWage.value.toFixed(2)} 元/小时 · 每秒收入：${perSecond.value.toFixed(4)} 元`
    : "请设置工资后开始学习",
);

function onWage(v: string | number): void {
  const parsed = typeof v === "number" ? v : parseFloat(v);
  if (Number.isNaN(parsed) || parsed < 0) return;
  if (settings.mode === "monthly") settings.monthly = parsed;
  else settings.hourly = parsed;
}
</script>

<template>
  <v-card class="settings-card card-el">
    <div class="card-title"><Wallet class="ic ic-card" />工资设置</div>
    <div class="settings-row">
      <v-btn-toggle
        :model-value="settings.mode"
        mandatory
        color="primary"
        :disabled="locked"
        aria-label="工资类型"
        @update:model-value="setMode"
      >
        <v-btn id="modeMonthly" value="monthly">月薪</v-btn>
        <v-btn id="modeHourly" value="hourly">时薪</v-btn>
      </v-btn-toggle>
      <v-text-field
        id="wageInput"
        class="wage-input"
        type="number"
        min="0"
        step="100"
        placeholder="如 20000"
        variant="outlined"
        density="comfortable"
        hide-details
        :model-value="wageShown"
        :disabled="locked"
        @update:model-value="onWage"
      />
      <span class="wage-unit">{{ settings.mode === "monthly" ? "元/月" : "元/小时" }}</span>
    </div>
    <div class="rate-hint" id="rateHint">{{ rateHint }}</div>
    <GenderPicker />
  </v-card>
</template>
