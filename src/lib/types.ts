/** 领域类型定义 */

export type WageMode = "monthly" | "hourly";

export interface Settings {
  mode: WageMode;
  monthly: number;
  hourly: number;
}

/** 进行中的计时会话（持久化到 localStorage，刷新恢复） */
export interface Session {
  running: boolean;
  paused: boolean;
  startTs: number;
  /** 累计暂停毫秒数 */
  pausedAccum: number;
  /** 暂停时刻（暂停中有效），null = 未暂停 */
  pausedAt: number | null;
}

/** 一条已结束的学习记录 */
export interface StudyRecord {
  id: string;
  /** 本地时区日期 YYYY-MM-DD（当日统计口径，勿用 UTC 的 toISOString 切片） */
  date: string;
  startIso: string;
  endIso: string;
  seconds: number;
  earned: number;
}

/** 设计语言主题（"" = 经典） */
export type ThemeLang = "" | "material" | "apple" | "fluent";
/** 深/浅色模式 */
export type ThemeMode = "dark" | "light";
