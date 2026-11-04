<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "./composables/useTheme";
import PageHeader from "./components/PageHeader.vue";
import CarbonApp from "./components/carbon/CarbonApp.vue";
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import WageSettings from "./components/WageSettings.vue";
import TimerCard from "./components/TimerCard.vue";
import StatsRow from "./components/StatsRow.vue";
import RecordList from "./components/RecordList.vue";

// 经典主题 → IBM Carbon 组件树；其余设计语言 → Vuetify 组件树
// （计时/主题状态在 composables 单例中，两棵树无缝共享）
const { themeLang } = useTheme();
const isClassic = computed(() => themeLang.value === "classic");
</script>

<template>
  <CarbonApp v-if="isClassic" />
  <v-app v-else>
    <v-main>
      <div class="page">
        <PageHeader />
        <ThemeSwitcher />
        <WageSettings />
        <TimerCard />
        <StatsRow />
        <RecordList />
        <footer class="page-footer">数据保存在本机浏览器（localStorage），刷新不丢失</footer>
      </div>
    </v-main>
  </v-app>
</template>
