<script setup lang="ts">
import { computed } from "vue";
import { Wallet } from "lucide-vue-next";
import { CvButton, CvTextInput } from "@carbon/vue";
import { useTimer } from "../../composables/useTimer";

const { settings, hourlyWage, perSecond, session } = useTimer();

const locked = computed(() => !!session.value);

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
  <section class="card-el carbon-card">
    <div class="card-title"><Wallet class="ic ic-card" />工资设置</div>
    <div class="settings-row">
      <div class="mode-switch carbon">
        <CvButton
          id="modeMonthly"
          size="small"
          :kind="settings.mode === 'monthly' ? 'primary' : 'tertiary'"
          :disabled="locked"
          @click="settings.mode = 'monthly'"
        >月薪</CvButton>
        <CvButton
          id="modeHourly"
          size="small"
          :kind="settings.mode === 'hourly' ? 'primary' : 'tertiary'"
          :disabled="locked"
          @click="settings.mode = 'hourly'"
        >时薪</CvButton>
      </div>
      <CvTextInput
        id="wageInput"
        class="wage-input"
        type="number"
        label="工资"
        hide-label
        placeholder="如 20000"
        :model-value="wageShown"
        :disabled="locked"
        @update:model-value="onWage"
      />
      <span class="wage-unit">{{ settings.mode === "monthly" ? "元/月" : "元/小时" }}</span>
    </div>
    <div class="rate-hint" id="rateHint">{{ rateHint }}</div>
  </section>
</template>
