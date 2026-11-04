<script setup lang="ts">
import { computed } from "vue";
import { Wallet } from "lucide-vue-next";
import { useTimer } from "../composables/useTimer";

const { settings, hourlyWage, perSecond, session } = useTimer();

const locked = computed(() => !!session.value);

function setMode(mode: "monthly" | "hourly"): void {
  if (locked.value) return;
  settings.mode = mode;
}

const rateHint = computed(() =>
  hourlyWage.value > 0
    ? `折算时薪：${hourlyWage.value.toFixed(2)} 元/小时 · 每秒收入：${perSecond.value.toFixed(4)} 元`
    : "请设置工资后开始学习",
);

function onWageInput(e: Event): void {
  const v = parseFloat((e.target as HTMLInputElement).value);
  if (Number.isNaN(v) || v < 0) return;
  if (settings.mode === "monthly") settings.monthly = v;
  else settings.hourly = v;
}
</script>

<template>
  <section class="card settings-card">
    <div class="card-title"><Wallet class="ic ic-card" />工资设置</div>
    <div class="settings-row">
      <div class="mode-switch" role="radiogroup" aria-label="工资类型">
        <button
          id="modeMonthly"
          class="mode-btn"
          :class="{ active: settings.mode === 'monthly' }"
          :disabled="locked"
          @click="setMode('monthly')"
        >月薪</button>
        <button
          id="modeHourly"
          class="mode-btn"
          :class="{ active: settings.mode === 'hourly' }"
          :disabled="locked"
          @click="setMode('hourly')"
        >时薪</button>
      </div>
      <div class="wage-input-wrap">
        <span class="wage-unit">{{ settings.mode === "monthly" ? "元/月" : "元/小时" }}</span>
        <input
          id="wageInput"
          type="number"
          min="0"
          step="100"
          placeholder="如 20000"
          :value="settings.mode === 'monthly' ? settings.monthly || '' : settings.hourly || ''"
          :disabled="locked"
          @input="onWageInput"
        >
      </div>
    </div>
    <div class="rate-hint" id="rateHint">{{ rateHint }}</div>
  </section>
</template>
