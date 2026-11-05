<script setup lang="ts">
/** 激励目标进度条（纯展示，跨组件树共用） */
import { computed } from "vue";
import { Target } from "lucide-vue-next";
import { useReward } from "../composables/useReward";

const { currentGoal, goalProgressRatio, achievedCount, totalGoals, totalEarned } = useReward();

const percent = computed(() => Math.round(goalProgressRatio.value * 100));
const remainText = computed(() => {
  const g = currentGoal.value;
  if (!g) return "";
  const remain = g.price - totalEarned.value;
  return remain > 0 ? `还差 ¥${remain.toFixed(2)}` : "";
});
</script>

<template>
  <div class="reward-goal">
    <div class="reward-line">
      <Target class="ic ic-sm" />
      <span v-if="currentGoal" class="reward-text">
        距离「{{ currentGoal.name }} ¥{{ currentGoal.price }}」
        <b class="reward-remain">{{ remainText }}</b>
      </span>
      <span v-else class="reward-text reward-done">
        🎉 全部 {{ totalGoals }} 个目标已解锁，继续加油！
      </span>
      <span class="reward-count">{{ achievedCount }}/{{ totalGoals }}</span>
    </div>
    <div class="reward-bar">
      <div class="reward-fill" :style="{ width: percent + '%' }"></div>
    </div>
  </div>
</template>
