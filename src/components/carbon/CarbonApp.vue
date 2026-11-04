<script setup lang="ts">
/** 经典主题的组件树：IBM Carbon 官方组件库（@carbon/vue）实现 */
import PageHeader from "../PageHeader.vue";
import CarbonThemeSwitcher from "./CarbonThemeSwitcher.vue";
import CarbonWageSettings from "./CarbonWageSettings.vue";
import CarbonTimerCard from "./CarbonTimerCard.vue";
import CarbonStatsRow from "./CarbonStatsRow.vue";
import CarbonRecordList from "./CarbonRecordList.vue";
</script>

<template>
  <div class="page">
    <PageHeader />
    <CarbonThemeSwitcher />
    <CarbonWageSettings />
    <CarbonTimerCard />
    <CarbonStatsRow />
    <CarbonRecordList />
    <footer class="page-footer">数据保存在本机浏览器（localStorage），刷新不丢失</footer>
  </div>
</template>
