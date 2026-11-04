<script setup lang="ts">
import { computed } from "vue";
import { Pause, Play, Square } from "lucide-vue-next";
import { useTimer } from "../composables/useTimer";
import { fmtDuration } from "../lib/format";

const { session, earned, elapsedSeconds, togglePrimary, pause, stop } = useTimer();

const isRunning = computed(() => !!session.value && !session.value.paused);
const isPaused = computed(() => !!session.value?.paused);
const statusText = computed(() =>
  !session.value ? "待开始" : session.value.paused ? "已暂停" : "挣钱中…",
);
const primaryLabel = computed(() => (session.value ? "继续" : "开始学习"));
const primaryDisabled = computed(() => isRunning.value);
</script>

<template>
  <section class="card main-card" :class="{ running: isRunning }">
    <div class="earned-label">本次已挣</div>
    <div class="earned-amount" id="earnedAmount">¥{{ earned.toFixed(4) }}</div>
    <div class="elapsed-label">已学习时长</div>
    <div class="elapsed-time" id="elapsedTime">{{ fmtDuration(elapsedSeconds) }}</div>
    <div class="status-dot" :class="{ running: isRunning, paused: isPaused }">
      <span class="dot"></span><span id="statusText">{{ statusText }}</span>
    </div>
    <div class="controls">
      <button class="btn btn-primary" id="startBtn" :disabled="primaryDisabled" @click="togglePrimary">
        <Play class="ic ic-btn" /><span id="startBtnText">{{ primaryLabel }}</span>
      </button>
      <button class="btn btn-secondary" id="pauseBtn" :disabled="!isRunning" @click="pause">
        <Pause class="ic ic-btn" />暂停
      </button>
      <button class="btn btn-danger" id="stopBtn" :disabled="!session" @click="stop">
        <Square class="ic ic-btn" />结束
      </button>
    </div>
  </section>
</template>
