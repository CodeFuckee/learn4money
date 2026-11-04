<script setup lang="ts">
import { CvTile } from "@carbon/vue";
import { useTimer } from "../../composables/useTimer";
import { fmtDurationCN } from "../../lib/format";

const { stats } = useTimer();
</script>

<template>
  <div class="stats-row">
    <CvTile class="stat">
      <div class="stat-value" id="todayEarned">¥{{ stats.todayEarned.toFixed(2) }}</div>
      <div class="stat-label">今日收入</div>
    </CvTile>
    <CvTile class="stat">
      <div class="stat-value" id="todayDuration">{{ fmtDurationCN(stats.todaySeconds) }}</div>
      <div class="stat-label">今日学习</div>
    </CvTile>
    <CvTile class="stat">
      <div class="stat-value" id="totalEarned">¥{{ stats.totalEarned.toFixed(2) }}</div>
      <div class="stat-label">累计收入</div>
    </CvTile>
  </div>
</template>
