<script setup lang="ts">
/** 性别选择（决定激励目标清单），纯按钮组，跨组件树共用 */
import { useReward } from "../composables/useReward";
import type { Gender } from "../lib/rewards";

const { gender, GENDERS, setGender } = useReward();

const LABELS: Record<Gender, string> = {
  female: "女生版目标",
  male: "男生版目标",
};
</script>

<template>
  <div class="gender-row">
    <span class="gender-label">激励目标</span>
    <div class="gender-switch" role="radiogroup" aria-label="激励目标风格">
      <button
        v-for="g in GENDERS"
        :key="g"
        class="gender-btn"
        :class="{ active: gender === g }"
        @click="setGender(g)"
      >{{ LABELS[g] }}</button>
    </div>
  </div>
</template>
