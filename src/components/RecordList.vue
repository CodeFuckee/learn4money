<script setup lang="ts">
import { ClipboardList, Rocket, Trash2 } from "lucide-vue-next";
import { useTimer } from "../composables/useTimer";
import { fmtDurationCN, fmtRecordDate } from "../lib/format";

const { records, clearRecords } = useTimer();

function onClear(): void {
  if (records.value.length === 0) return;
  if (window.confirm("确定清空全部学习记录吗？此操作不可恢复。")) clearRecords();
}
</script>

<template>
  <section class="card history-card">
    <div class="history-header">
      <div class="card-title"><ClipboardList class="ic ic-card" />学习记录</div>
      <button class="btn-link" id="clearBtn" @click="onClear">
        <Trash2 class="ic ic-xs" />清空
      </button>
    </div>
    <ul class="record-list" id="recordList">
      <li v-for="r in records.slice(0, 50)" :key="r.id" class="record-item">
        <span class="record-time">{{ fmtRecordDate(r.startIso) }}</span>
        <span class="record-detail">{{ fmtDurationCN(r.seconds) }}</span>
        <span class="record-earned">+¥{{ r.earned.toFixed(2) }}</span>
      </li>
    </ul>
    <div class="empty-hint" id="emptyHint" v-show="records.length === 0">
      <Rocket class="ic ic-sm" />还没有记录，点击「开始学习」赚第一笔吧
    </div>
  </section>
</template>
