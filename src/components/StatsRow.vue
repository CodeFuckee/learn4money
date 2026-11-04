<script setup lang="ts">
import { useTimer } from "../composables/useTimer";
import { fmtDurationCN } from "../lib/format";

const { stats } = useTimer();
</script>

<template>
  <div class="stats-row">
    <v-card class="stat card-el">
      <div class="stat-value" id="todayEarned">¥{{ stats.todayEarned.toFixed(2) }}</div>
      <div class="stat-label">今日收入</div>
    </v-card>
    <v-card class="stat card-el">
      <div class="stat-value" id="todayDuration">{{ fmtDurationCN(stats.todaySeconds) }}</div>
      <div class="stat-label">今日学习</div>
    </v-card>
    <v-card class="stat card-el">
      <div class="stat-value" id="totalEarned">¥{{ stats.totalEarned.toFixed(2) }}</div>
      <div class="stat-label">累计收入</div>
    </v-card>
  </div>
</template>
