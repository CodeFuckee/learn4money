<script setup lang="ts">
import { computed, ref } from "vue";
import { useTheme } from "./composables/useTheme";
import { useBreakpoints } from "./composables/useBreakpoints";
import PageHeader from "./components/PageHeader.vue";
import CarbonApp from "./components/carbon/CarbonApp.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import WageSettings from "./components/WageSettings.vue";
import TimerCard from "./components/TimerCard.vue";
import StatsRow from "./components/StatsRow.vue";
import RecordList from "./components/RecordList.vue";
import { Settings } from "lucide-vue-next";

// 经典主题 → IBM Carbon 组件树；其余设计语言 → Vuetify 组件树
// （计时/主题状态在 composables 单例中，两棵树无缝共享）
const { themeLang } = useTheme();
const isClassic = computed(() => themeLang.value === "classic");

// 大屏模式（≥1280）：金额全屏居中，设置与记录收进对话框
const { isBigScreen } = useBreakpoints();
const settingsOpen = ref(false);
</script>

<template>
  <CarbonApp v-if="isClassic" />
  <v-app v-else>
    <v-main>
      <!-- 大屏模式：金额巨字正中央，其他信息小字，设置收进右上角对话框 -->
      <div v-if="isBigScreen" class="page bigscreen">
        <header class="bs-topbar">
          <PageHeader />
          <div class="bs-actions">
            <ThemeSwitcher />
            <v-btn
              id="settingsBtn"
              icon
              variant="tonal"
              color="primary"
              aria-label="打开设置"
              title="设置"
              @click="settingsOpen = true"
            >
              <Settings class="ic ic-sm" />
            </v-btn>
          </div>
        </header>
        <main class="bs-center">
          <TimerCard />
        </main>
        <footer class="bs-stats-row">
          <StatsRow />
        </footer>
        <v-dialog v-model="settingsOpen" max-width="720">
          <v-card class="card-el dialog-el">
            <v-card-title>设置与记录</v-card-title>
            <v-card-text class="bs-dialog-body">
              <WageSettings />
              <RecordList />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn variant="text" @click="settingsOpen = false">关闭</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
      <!-- 窄屏：卡片流布局 -->
      <div v-else class="page">
        <PageHeader />
        <ThemeSwitcher />
        <div class="content-grid">
          <div class="col-main">
            <TimerCard />
          </div>
          <div class="col-side">
            <WageSettings />
            <StatsRow />
            <RecordList />
          </div>
        </div>
        <footer class="page-footer">数据保存在本机浏览器（localStorage），刷新不丢失</footer>
      </div>
    </v-main>
  </v-app>
</template>
