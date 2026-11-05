<script setup lang="ts">
/** 经典主题的组件树：IBM Carbon 官方组件库（@carbon/vue）实现 */
import { computed, ref } from "vue";
import { Settings } from "lucide-vue-next";
import { CvButton, CvModal } from "@carbon/vue";
import { useTheme } from "../../composables/useTheme";
import { useBreakpoints } from "../../composables/useBreakpoints";
import PageHeader from "../PageHeader.vue";
import CarbonThemeSwitcher from "./CarbonThemeSwitcher.vue";
import CarbonWageSettings from "./CarbonWageSettings.vue";
import CarbonTimerCard from "./CarbonTimerCard.vue";
import CarbonStatsRow from "./CarbonStatsRow.vue";
import CarbonRecordList from "./CarbonRecordList.vue";

const { themeLang } = useTheme();
const isClassic = computed(() => themeLang.value === "classic");

// 大屏模式（≥1280）：金额全屏居中，设置与记录收进对话框
const { isBigScreen } = useBreakpoints();
const settingsOpen = ref(false);
</script>

<template>
  <!-- 大屏模式：金额巨字正中央，其他信息小字，设置收进右上角对话框 -->
  <div v-if="isClassic && isBigScreen" class="page bigscreen">
    <header class="bs-topbar">
      <PageHeader />
      <div class="bs-actions">
        <CarbonThemeSwitcher />
        <CvButton
          id="settingsBtn"
          size="small"
          kind="tertiary"
          aria-label="打开设置"
          title="设置"
          @click="settingsOpen = true"
        >
          <Settings class="ic ic-sm" />设置
        </CvButton>
      </div>
    </header>
    <main class="bs-center">
      <CarbonTimerCard />
    </main>
    <footer class="bs-stats-row">
      <CarbonStatsRow />
    </footer>
    <CvModal
      :visible="settingsOpen"
      close-aria-label="关闭设置"
      @modal-hidden="settingsOpen = false"
    >
      <template #title>设置与记录</template>
      <template #content>
        <div class="bs-dialog-body">
          <CarbonWageSettings />
          <CarbonRecordList />
        </div>
      </template>
      <template #secondary-button>
        <CvButton kind="secondary" @click="settingsOpen = false">关闭</CvButton>
      </template>
    </CvModal>
  </div>
  <!-- 窄屏：卡片流布局 -->
  <div v-else class="page">
    <PageHeader />
    <CarbonThemeSwitcher />
    <div class="content-grid">
      <div class="col-main">
        <CarbonTimerCard />
      </div>
      <div class="col-side">
        <CarbonWageSettings />
        <CarbonStatsRow />
        <CarbonRecordList />
      </div>
    </div>
    <footer class="page-footer">数据保存在本机浏览器（localStorage），刷新不丢失</footer>
  </div>
</template>
