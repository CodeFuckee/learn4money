<script setup lang="ts">
/** 大屏模式底部的累计学习记录列表（纯展示，跨组件树共用；清空用原生 confirm） */
import { computed } from "vue";
import { useTimer } from "../composables/useTimer";
import { fmtDurationCN } from "../lib/format";

const { records, notice, clearRecords } = useTimer();
const list = computed(() => records.value.slice(0, 100));

function fmtClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

function onClear(): void {
  if (!records.value.length) return;
  if (window.confirm(`清空全部 ${records.value.length} 条学习记录？此操作不可恢复。`)) clearRecords();
}
</script>

<template>
  <div class="bs-records">
    <div v-if="notice" class="bs-notice">{{ notice }}</div>
    <div class="bs-records-head">
      <span>学习记录（{{ records.length }}）</span>
      <button class="bs-clear" :disabled="!records.length" @click="onClear">清空</button>
    </div>
    <div class="bs-record-list">
      <div v-for="r in list" :key="r.id" class="bs-record-row">
        <span class="bs-record-time">{{ fmtClock(r.startIso) }}</span>
        <span class="bs-record-dur">{{ fmtDurationCN(r.seconds) }}</span>
        <span class="bs-record-earned">+¥{{ r.earned.toFixed(2) }}</span>
      </div>
      <div v-if="!records.length" class="bs-record-empty">
        还没有记录，点击「开始学习」赚第一笔吧
      </div>
    </div>
  </div>
</template>
