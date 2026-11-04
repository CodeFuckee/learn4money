/** 计时会话状态机（模块级单例，供多组件共享）
 *
 * 核心不变式：时长/金额不靠累加器，每帧从时间戳重算
 *   elapsed = (pausedAt ?? now) - startTs - pausedAccum
 * 页面刷新、电脑休眠后依然准确。
 */
import { computed, reactive, ref, watch } from "vue";
import { loadJSON, removeKey, saveJSON } from "../lib/storage";
import { getHourlyWage, getPerSecond } from "../lib/wage";
import { dateKey } from "../lib/format";
import type { Session, Settings, StudyRecord } from "../lib/types";

const KEYS = {
  settings: "l4m.settings",
  session: "l4m.session",
  records: "l4m.records",
} as const;

/** 少于 5 秒视为误触，不入记录 */
const MIN_RECORD_SECONDS = 5;

const settings = reactive<Settings>(
  loadJSON<Settings>(KEYS.settings, { mode: "monthly", monthly: 20000, hourly: 50 }),
);
const session = ref<Session | null>(loadJSON<Session | null>(KEYS.session, null));
const records = ref<StudyRecord[]>(loadJSON<StudyRecord[]>(KEYS.records, []));

/** 每帧心跳：仅在计时中驱动响应式更新 */
const now = ref(Date.now());
function tick(): void {
  if (session.value?.running && !session.value.paused) now.value = Date.now();
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);

// ---------- 派生 ----------

const hourlyWage = computed(() => getHourlyWage(settings));
const perSecond = computed(() => getPerSecond(settings));

const elapsedSeconds = computed(() => {
  const s = session.value;
  if (!s) return 0;
  const end = s.paused && s.pausedAt !== null ? s.pausedAt : now.value;
  return Math.max(0, (end - s.startTs - s.pausedAccum) / 1000);
});

const earned = computed(() => elapsedSeconds.value * perSecond.value);

/** 统计（含进行中的会话） */
const stats = computed(() => {
  const today = dateKey(new Date());
  let todaySeconds = 0;
  let todayEarned = 0;
  let totalEarned = 0;
  for (const r of records.value) {
    totalEarned += r.earned;
    if (r.date === today) {
      todaySeconds += r.seconds;
      todayEarned += r.earned;
    }
  }
  todaySeconds += elapsedSeconds.value;
  todayEarned += earned.value;
  totalEarned += earned.value;
  return { todaySeconds, todayEarned, totalEarned };
});

// ---------- 持久化 ----------

function persistSession(): void {
  if (session.value) saveJSON(KEYS.session, session.value);
  else removeKey(KEYS.session);
}

watch(
  settings,
  (v) => saveJSON(KEYS.settings, { ...v }),
  { deep: true },
);

// ---------- 操作 ----------

function start(): void {
  session.value = { running: true, paused: false, startTs: Date.now(), pausedAccum: 0, pausedAt: null };
  persistSession();
}

function pause(): void {
  const s = session.value;
  if (!s || s.paused) return;
  s.paused = true;
  s.pausedAt = Date.now();
  persistSession();
}

function resume(): void {
  const s = session.value;
  if (!s || !s.paused) return;
  s.pausedAccum += Date.now() - (s.pausedAt ?? Date.now());
  s.paused = false;
  s.pausedAt = null;
  persistSession();
}

function stop(): void {
  const s = session.value;
  if (!s) return;
  const seconds = elapsedSeconds.value;
  const earnedValue = seconds * perSecond.value;
  const startTs = s.startTs;
  session.value = null;
  persistSession();
  if (seconds >= MIN_RECORD_SECONDS) {
    records.value.unshift({
      id: `${Date.now()}`,
      date: dateKey(new Date(startTs)),
      startIso: new Date(startTs).toISOString(),
      endIso: new Date().toISOString(),
      seconds,
      earned: earnedValue,
    });
    saveJSON(KEYS.records, records.value);
  }
}

/** 主按钮语义：无会话 → 开始学习；暂停 → 继续 */
function togglePrimary(): void {
  if (session.value?.paused) resume();
  else if (!session.value) start();
}

/** 清空全部学习记录（UI 层负责确认） */
function clearRecords(): void {
  records.value = [];
  saveJSON(KEYS.records, records.value);
}

export function useTimer() {
  return {
    settings,
    session,
    records,
    hourlyWage,
    perSecond,
    elapsedSeconds,
    earned,
    stats,
    start,
    pause,
    resume,
    stop,
    togglePrimary,
    clearRecords,
  };
}
