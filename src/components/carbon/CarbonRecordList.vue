<script setup lang="ts">
import { ref } from "vue";
import { ClipboardList, Rocket, Trash2 } from "lucide-vue-next";
import { CvButton, CvList, CvListItem, CvModal } from "@carbon/vue";
import { useTimer } from "../../composables/useTimer";
import { fmtDurationCN, fmtRecordDate } from "../../lib/format";

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
  <section class="card-el carbon-card history-card">
    <div class="history-header">
      <div class="card-title"><ClipboardList class="ic ic-card" />学习记录</div>
      <CvButton id="clearBtn" size="small" kind="danger--ghost" :disabled="records.length === 0" @click="onClear">
        <Trash2 class="ic ic-xs" />清空
      </CvButton>
    </div>
    <CvList id="recordList" class="record-list">
      <CvListItem v-for="r in records.slice(0, 50)" :key="r.id" class="record-item">
        <span class="record-detail">
          <span class="record-time">{{ fmtRecordDate(r.startIso) }}</span>
          {{ fmtDurationCN(r.seconds) }}
        </span>
        <span class="record-earned">+¥{{ r.earned.toFixed(2) }}</span>
      </CvListItem>
    </CvList>
    <div class="empty-hint" id="emptyHint" v-show="records.length === 0">
      <Rocket class="ic ic-sm" />还没有记录，点击「开始学习」赚第一笔吧
    </div>
  </section>

  <CvModal
    :visible="confirmOpen"
    kind="danger"
    @modal-hidden="confirmOpen = false"
    @primary-click="doClear"
  >
    <template #title>清空学习记录？</template>
    <template #content>将删除全部 {{ records.length }} 条学习记录，此操作不可恢复。</template>
    <template #secondary-button>
      <CvButton kind="secondary" @click="confirmOpen = false">取消</CvButton>
    </template>
    <template #primary-button>
      <CvButton id="confirmClear" kind="danger--primary" @click="doClear">清空</CvButton>
    </template>
  </CvModal>
</template>
