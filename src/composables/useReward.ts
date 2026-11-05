/** 激励目标：性别偏好（持久化）+ 当前进度派生 */
import { computed, ref, watch } from "vue";
import { loadJSON, saveJSON } from "../lib/storage";
import { goalProgress, REWARDS, type Gender, type RewardGoal } from "../lib/rewards";
import { useTimer } from "./useTimer";

const KEY = "l4m.gender";

const GENDERS: Gender[] = ["female", "male"];

function normalize(v: unknown): Gender {
  return GENDERS.includes(v as Gender) ? (v as Gender) : "female";
}

const gender = ref<Gender>(normalize(loadJSON<Gender>(KEY, "female")));
watch(gender, (v) => saveJSON(KEY, v));

const { stats } = useTimer();

const totalEarned = computed(() => stats.value.totalEarned);

/** 当前指向的未达成目标（全部达成时为 null） */
const currentGoal = computed<RewardGoal | null>(
  () => goalProgress(gender.value, totalEarned.value)?.goal ?? null,
);
const goalProgressRatio = computed(
  () => goalProgress(gender.value, totalEarned.value)?.progress ?? 1,
);
/** 已解锁的目标数 */
const achievedCount = computed(
  () => goalProgress(gender.value, totalEarned.value)?.achievedCount ?? 0,
);
const totalGoals = computed(() => (REWARDS[gender.value] ?? REWARDS.female).length);

function setGender(g: Gender): void {
  if (GENDERS.includes(g)) gender.value = g;
}

export function useReward() {
  return {
    gender,
    GENDERS,
    setGender,
    currentGoal,
    goalProgressRatio,
    achievedCount,
    totalGoals,
    totalEarned,
  };
}
