/** 工资换算：月薪按中国劳动法计薪口径折算（21.75 天/月 × 8 小时/天） */
import type { Settings } from "./types";

const MONTHLY_WORK_DAYS = 21.75;
const DAILY_WORK_HOURS = 8;

export function getHourlyWage(settings: Settings): number {
  if (settings.mode === "monthly") {
    return (settings.monthly || 0) / MONTHLY_WORK_DAYS / DAILY_WORK_HOURS;
  }
  return settings.hourly || 0;
}

export function getPerSecond(settings: Settings): number {
  return getHourlyWage(settings) / 3600;
}
