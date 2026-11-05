<script setup lang="ts">
import { computed, ref } from "vue";
import { Pause, Play, Square } from "lucide-vue-next";
import { useTimer } from "../composables/useTimer";
import { useEarnedBump } from "../composables/useEarnedBump";
import { fmtDuration } from "../lib/format";
import RewardGoal from "./RewardGoal.vue";

const { session, earned, elapsedSeconds, togglePrimary, pause, stop } = useTimer();

const earnedEl = ref<HTMLElement>();
useEarnedBump(earned, earnedEl);

const isRunning = computed(() => !!session.value && !session.value.paused);
const isPaused = computed(() => !!session.value?.paused);
const statusText = computed(() =>
  !session.value ? "待开始" : session.value.paused ? "已暂停" : "挣钱中…",
);
const primaryLabel = computed(() => (session.value ? "继续" : "开始学习"));
const primaryDisabled = computed(() => isRunning.value);
</script>

<template>
  <v-card class="main-card card-el" :class="{ running: isRunning }">
    <div class="earned-label">本次已挣</div>
    <div class="earned-amount" id="earnedAmount" ref="earnedEl">¥{{ earned.toFixed(2) }}</div>
    <div class="elapsed-label">已学习时长</div>
    <div class="elapsed-time" id="elapsedTime">{{ fmtDuration(elapsedSeconds) }}</div>
    <RewardGoal />
    <div class="status-dot" :class="{ running: isRunning, paused: isPaused }">
      <span class="dot"></span><span id="statusText">{{ statusText }}</span>
    </div>
    <div class="controls">
      <v-btn
        id="startBtn"
        class="btn-el"
        color="primary"
        variant="flat"
        :disabled="primaryDisabled"
        @click="togglePrimary"
      >
        <Play class="ic ic-btn" /><span id="startBtnText">{{ primaryLabel }}</span>
      </v-btn>
      <v-btn id="pauseBtn" class="btn-el" variant="tonal" :disabled="!isRunning" @click="pause">
        <Pause class="ic ic-btn" />暂停
      </v-btn>
      <v-btn id="stopBtn" class="btn-el" variant="tonal" color="error" :disabled="!session" @click="stop">
        <Square class="ic ic-btn" />结束
      </v-btn>
    </div>
  </v-card>
</template>
