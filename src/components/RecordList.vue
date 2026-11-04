<script setup lang="ts">
import { ref } from "vue";
import { ClipboardList, Rocket, Trash2 } from "lucide-vue-next";
import { useTimer } from "../composables/useTimer";
import { fmtDurationCN, fmtRecordDate } from "../lib/format";

const { records, clearRecords } = useTimer();

const confirmOpen = ref(false);

function onClear(): void {
  if (records.value.length === 0) return;
  confirmOpen.value = true;
}

function doClear(): void {
  clearRecords();
  confirmOpen.value = false;
}
</script>

<template>
  <v-card class="history-card card-el">
    <div class="history-header">
      <div class="card-title"><ClipboardList class="ic ic-card" />学习记录</div>
      <v-btn
        id="clearBtn"
        variant="text"
        color="error"
        size="small"
        :disabled="records.length === 0"
        @click="onClear"
      >
        <Trash2 class="ic ic-xs" />清空
      </v-btn>
    </div>
    <v-list id="recordList" class="record-list" density="compact">
      <v-list-item
        v-for="r in records.slice(0, 50)"
        :key="r.id"
        class="record-item"
        :title="fmtDurationCN(r.seconds)"
        :subtitle="fmtRecordDate(r.startIso)"
      >
        <template #append>
          <span class="record-earned">+¥{{ r.earned.toFixed(2) }}</span>
        </template>
      </v-list-item>
    </v-list>
    <div class="empty-hint" id="emptyHint" v-show="records.length === 0">
      <Rocket class="ic ic-sm" />还没有记录，点击「开始学习」赚第一笔吧
    </div>
  </v-card>

  <v-dialog v-model="confirmOpen" max-width="360">
    <v-card class="card-el dialog-el">
      <v-card-title>清空学习记录？</v-card-title>
      <v-card-text>将删除全部 {{ records.length }} 条记录，此操作不可恢复。</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="confirmOpen = false">取消</v-btn>
        <v-btn id="confirmClear" color="error" variant="flat" @click="doClear">清空</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
