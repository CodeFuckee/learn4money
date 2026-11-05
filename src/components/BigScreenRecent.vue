<script setup lang="ts">
/** 大屏模式底部的最近记录条（纯展示，跨组件树共用） */
import { computed } from "vue";
import { useTimer } from "../composables/useTimer";
import { fmtDurationCN } from "../lib/format";

const { records } = useTimer();
const recent = computed(() => records.value.slice(0, 3));

function fmtClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}
</script>

<template>
  <div v-if="recent.length" class="bs-recent">
    <div v-for="r in recent" :key="r.id" class="bs-recent-item">
      <span class="bs-recent-time">{{ fmtClock(r.startIso) }}</span>
      <span class="bs-recent-dur">{{ fmtDurationCN(r.seconds) }}</span>
      <span class="bs-recent-earned">+¥{{ r.earned.toFixed(2) }}</span>
    </div>
    <div class="bs-recent-hint">全部记录见右上角 ⚙ 设置</div>
  </div>
</template>
