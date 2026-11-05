<script setup lang="ts">
/** 激励目标卡片：大图标徽章 + 目标文案 + 进度条（纯展示，跨组件树共用） */
import { computed, watch, ref } from "vue";
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

/* 目标晋级时徽章弹跳 */
const badgeEl = ref<HTMLElement>();
watch(currentGoal, () => {
  const node = badgeEl.value;
  if (node) {
    node.classList.remove("goal-pop");
    void node.offsetWidth;
    node.classList.add("goal-pop");
  }
});
</script>

<template>
  <div class="reward-goal">
    <div class="reward-main">
      <div ref="badgeEl" class="reward-badge" :key="currentGoal?.name">
        <component :is="currentGoal?.icon ?? Target" class="reward-icon" />
      </div>
      <div class="reward-info">
        <div class="reward-line">
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
    </div>
  </div>
</template>
