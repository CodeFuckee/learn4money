/* 学习挣钱看板 — 核心逻辑
 *
 * 设计要点：
 * - 金额与时长不靠累加器，而是每帧从时间戳重算：
 *   elapsed = (pausedAt ?? now) - startTs - pausedAccum
 *   页面刷新、电脑休眠后时间依然准确。
 * - 进行中的会话持久化到 localStorage，刷新后自动恢复计时。
 * - 月薪按中国劳动法计薪口径折算时薪：月薪 / 21.75 天 / 8 小时。
 */

const STORAGE_KEYS = {
  settings: "l4m.settings",
  session: "l4m.session",
  records: "l4m.records",
  theme: "l4m.theme",
};

const THEMES = ["", "material", "apple", "fluent"]; // "" = 经典

const MIN_RECORD_SECONDS = 5; // 少于 5 秒视为误触，不记录

// ---------- 工具 ----------

const $ = (id) => document.getElementById(id);

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** 秒数 → HH:MM:SS */
function fmtDuration(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

/** 秒数 → 中文口语（用于统计与记录） */
function fmtDurationCN(totalSeconds) {
  const s = Math.round(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h} 小时 ${m} 分`;
  if (m > 0) return `${m} 分 ${sec} 秒`;
  return `${sec} 秒`;
}

/** 日期 → YYYY-MM-DD（本地时区） */
function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 记录条目的展示时间：今天 → "今天 HH:MM"，昨天 → "昨天 HH:MM"，更早 → "M月D日 HH:MM" */
function fmtRecordDate(iso) {
  const d = new Date(iso);
  const hm = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  const today = dateKey(new Date());
  const yesterday = dateKey(new Date(Date.now() - 86400000));
  const dk = dateKey(d);
  if (dk === today) return `今天 ${hm}`;
  if (dk === yesterday) return `昨天 ${hm}`;
  return `${d.getMonth() + 1}月${d.getDate()}日 ${hm}`;
}

// ---------- 状态 ----------

// settings: { mode: 'monthly'|'hourly', monthly: number, hourly: number }
let settings = loadJSON(STORAGE_KEYS.settings, {
  mode: "monthly",
  monthly: 20000,
  hourly: 50,
});

// session: { running, paused, startTs, pausedAccum, pausedAt } | null
let session = loadJSON(STORAGE_KEYS.session, null);

// records: [{ id, startIso, endIso, seconds, earned }] 新的在前
let records = loadJSON(STORAGE_KEYS.records, []);

let rafTimer = null;

// ---------- 工资换算 ----------

function getHourlyWage() {
  if (settings.mode === "monthly") {
    return (settings.monthly || 0) / 21.75 / 8;
  }
  return settings.hourly || 0;
}

function getPerSecond() {
  return getHourlyWage() / 3600;
}

// ---------- 会话时长 / 金额 ----------

function currentElapsedSeconds() {
  if (!session) return 0;
  const now = session.paused ? session.pausedAt : Date.now();
  return Math.max(0, (now - session.startTs - session.pausedAccum) / 1000);
}

function currentEarned() {
  return currentElapsedSeconds() * getPerSecond();
}

// ---------- 渲染 ----------

function render() {
  // 工资设置区
  $("wageInput").value =
    settings.mode === "monthly" ? settings.monthly || "" : settings.hourly || "";
  $("wageUnit").textContent = settings.mode === "monthly" ? "元/月" : "元/小时";
  const hourly = getHourlyWage();
  const perSec = getPerSecond();
  $("rateHint").textContent =
    hourly > 0
      ? `折算时薪：${hourly.toFixed(2)} 元/小时 · 每秒收入：${perSec.toFixed(4)} 元`
      : "请设置工资后开始学习";

  // 主看板
  const running = session && session.running && !session.paused;
  const elapsed = currentElapsedSeconds();
  $("earnedAmount").textContent = `¥${currentEarned().toFixed(4)}`;
  $("elapsedTime").textContent = fmtDuration(elapsed);

  const mainCard = $("mainCard");
  const dot = $("statusDot");
  mainCard.classList.toggle("running", !!running);
  dot.classList.toggle("running", !!running);
  dot.classList.toggle("paused", !!(session && session.paused));

  if (!session) {
    $("statusText").textContent = "待开始";
    $("startBtnText").textContent = "开始学习";
    $("startBtn").disabled = false;
    $("pauseBtn").disabled = true;
    $("stopBtn").disabled = true;
  } else if (session.paused) {
    $("statusText").textContent = "已暂停";
    $("startBtnText").textContent = "继续";
    $("startBtn").disabled = false;
    $("pauseBtn").disabled = true;
    $("stopBtn").disabled = false;
  } else {
    $("statusText").textContent = "挣钱中…";
    $("startBtnText").textContent = "继续";
    $("startBtn").disabled = true;
    $("pauseBtn").disabled = false;
    $("stopBtn").disabled = false;
  }

  // 运行中锁定工资设置
  const locked = !!session;
  $("wageInput").disabled = locked;
  document.querySelectorAll(".mode-btn").forEach((b) => (b.disabled = locked));

  // 统计
  const today = dateKey(new Date());
  let todaySeconds = 0;
  let todayEarned = 0;
  let totalEarned = 0;
  for (const r of records) {
    totalEarned += r.earned;
    if (r.date === today) {
      todaySeconds += r.seconds;
      todayEarned += r.earned;
    }
  }
  if (session) {
    const es = currentElapsedSeconds();
    const ee = es * getPerSecond();
    todaySeconds += es;
    todayEarned += ee;
    totalEarned += ee;
  }
  $("todayEarned").textContent = `¥${todayEarned.toFixed(2)}`;
  $("todayDuration").textContent = fmtDurationCN(todaySeconds);
  $("totalEarned").textContent = `¥${totalEarned.toFixed(2)}`;

  // 记录列表
  const list = $("recordList");
  list.innerHTML = "";
  for (const r of records.slice(0, 50)) {
    const li = document.createElement("li");
    li.className = "record-item";
    li.innerHTML = `
      <span class="record-time">${fmtRecordDate(r.startIso)}</span>
      <span class="record-detail">${fmtDurationCN(r.seconds)}</span>
      <span class="record-earned">+¥${r.earned.toFixed(2)}</span>`;
    list.appendChild(li);
  }
  $("emptyHint").style.display = records.length === 0 ? "" : "none";
}

function tick() {
  if (session && session.running && !session.paused) {
    $("earnedAmount").textContent = `¥${currentEarned().toFixed(4)}`;
    $("elapsedTime").textContent = fmtDuration(currentElapsedSeconds());
    updateLiveStats();
  }
  rafTimer = requestAnimationFrame(tick);
}

/** 运行中轻量更新统计数字，避免每帧全量重渲染 */
function updateLiveStats() {
  const today = dateKey(new Date());
  let todaySeconds = 0;
  let todayEarned = 0;
  let totalEarned = 0;
  for (const r of records) {
    totalEarned += r.earned;
    if (r.date === today) {
      todaySeconds += r.seconds;
      todayEarned += r.earned;
    }
  }
  const es = currentElapsedSeconds();
  const ee = es * getPerSecond();
  $("todayEarned").textContent = `¥${(todayEarned + ee).toFixed(2)}`;
  $("todayDuration").textContent = fmtDurationCN(todaySeconds + es);
  $("totalEarned").textContent = `¥${(totalEarned + ee).toFixed(2)}`;
}

// ---------- 操作 ----------

function persistSession() {
  if (session) saveJSON(STORAGE_KEYS.session, session);
  else localStorage.removeItem(STORAGE_KEYS.session);
}

function start() {
  session = {
    running: true,
    paused: false,
    startTs: Date.now(),
    pausedAccum: 0,
    pausedAt: null,
  };
  persistSession();
  render();
}

function pause() {
  if (!session || session.paused) return;
  session.paused = true;
  session.pausedAt = Date.now();
  persistSession();
  render();
}

function resume() {
  if (!session || !session.paused) return;
  session.pausedAccum += Date.now() - session.pausedAt;
  session.paused = false;
  session.pausedAt = null;
  persistSession();
  render();
}

function stop() {
  if (!session) return;
  const seconds = currentElapsedSeconds();
  const earned = seconds * getPerSecond();
  const startTs = session.startTs;
  const startIso = new Date(startTs).toISOString();
  session = null;
  persistSession();
  if (seconds >= MIN_RECORD_SECONDS) {
    records.unshift({
      id: `${Date.now()}`,
      date: dateKey(new Date(startTs)),
      startIso,
      endIso: new Date().toISOString(),
      seconds,
      earned,
    });
    saveJSON(STORAGE_KEYS.records, records);
  }
  render();
}

// ---------- 事件绑定 ----------

$("startBtn").addEventListener("click", () => {
  if (session && session.paused) resume();
  else if (!session) start();
});

$("pauseBtn").addEventListener("click", pause);
$("stopBtn").addEventListener("click", stop);

$("modeMonthly").addEventListener("click", () => setMode("monthly"));
$("modeHourly").addEventListener("click", () => setMode("hourly"));

function setMode(mode) {
  if (session) return;
  settings.mode = mode;
  saveJSON(STORAGE_KEYS.settings, settings);
  document
    .querySelectorAll(".mode-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.mode === mode));
  render();
}

$("wageInput").addEventListener("input", () => {
  const v = parseFloat($("wageInput").value);
  if (isNaN(v) || v < 0) return;
  if (settings.mode === "monthly") settings.monthly = v;
  else settings.hourly = v;
  saveJSON(STORAGE_KEYS.settings, settings);
  // 设置即时反映到折算提示（不打断主看板动画）
  const hourly = getHourlyWage();
  $("rateHint").textContent =
    hourly > 0
      ? `折算时薪：${hourly.toFixed(2)} 元/小时 · 每秒收入：${getPerSecond().toFixed(4)} 元`
      : "请设置工资后开始学习";
  updateLiveStats();
});

$("clearBtn").addEventListener("click", () => {
  if (records.length === 0) return;
  if (confirm("确定清空全部学习记录吗？此操作不可恢复。")) {
    records = [];
    saveJSON(STORAGE_KEYS.records, records);
    render();
  }
});

// ---------- 主题切换 ----------

function setTheme(theme) {
  if (!THEMES.includes(theme)) theme = "";
  if (theme) document.body.dataset.theme = theme;
  else delete document.body.dataset.theme;
  saveJSON(STORAGE_KEYS.theme, theme);
  document
    .querySelectorAll(".theme-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.theme === theme));
}

$("themeSwitch").addEventListener("click", (e) => {
  const btn = e.target.closest(".theme-btn");
  if (btn) setTheme(btn.dataset.theme);
});

// ---------- 启动 ----------

// 恢复上次的工资模式高亮
document
  .querySelectorAll(".mode-btn")
  .forEach((b) => b.classList.toggle("active", b.dataset.mode === settings.mode));

render();
tick();
setTheme(loadJSON(STORAGE_KEYS.theme, ""));

// 渲染 Lucide 图标（vendor 加载失败时页面仍完整可用，只是无图标）
if (window.lucide) lucide.createIcons();
