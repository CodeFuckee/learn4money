<script setup lang="ts">
import ThemeSwitcher from "./components/ThemeSwitcher.vue";
import WageSettings from "./components/WageSettings.vue";
import TimerCard from "./components/TimerCard.vue";
import StatsRow from "./components/StatsRow.vue";
import RecordList from "./components/RecordList.vue";
import { BookOpen } from "lucide-vue-next";
</script>

<template>
  <v-app>
    <v-main>
      <div class="page">
        <header class="page-header">
          <h1><BookOpen class="ic ic-title" />学习挣钱</h1>
          <p class="subtitle">学一分钟，挣一分钟的钱</p>
        </header>

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
