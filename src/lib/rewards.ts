/** 物质激励目标：按性别区分的阶梯清单（价格升序）
 *  累计收入每达到一档即「解锁」该目标，进度条始终指向下一档。
 *  icon 为彩色 emoji（视觉主角；页面操作图标仍统一用 Lucide）。 */

export type Gender = "male" | "female";

export interface RewardGoal {
  name: string;
  price: number;
  icon: string;
}

export const REWARDS: Record<Gender, RewardGoal[]> = {
  male: [
    { name: "一杯咖啡", price: 15, icon: "☕" },
    { name: "一顿烧烤", price: 45, icon: "🍢" },
    { name: "一顿火锅", price: 110, icon: "🍲" },
    { name: "一款新游戏", price: 199, icon: "🎮" },
    { name: "一双球鞋", price: 599, icon: "👟" },
    { name: "一个机械键盘", price: 899, icon: "⌨️" },
    { name: "一块手表", price: 1999, icon: "⌚" },
    { name: "一台游戏机", price: 2999, icon: "🕹️" },
  ],
  female: [
    { name: "一杯奶茶", price: 15, icon: "🧋" },
    { name: "一块蛋糕", price: 38, icon: "🍰" },
    { name: "一顿火锅", price: 110, icon: "🍲" },
    { name: "一支口红", price: 199, icon: "💄" },
    { name: "一瓶香水", price: 399, icon: "🌸" },
    { name: "一套护肤精华", price: 899, icon: "🧴" },
    { name: "一个包包", price: 1599, icon: "👜" },
    { name: "一条项链", price: 2999, icon: "💎" },
  ],
};

/** 当前进度：返回最近一个未达成的目标与完成进度（0~1） */
export function goalProgress(
  gender: Gender,
  totalEarned: number,
): { goal: RewardGoal; progress: number; achievedCount: number } | null {
  const list = REWARDS[gender] ?? REWARDS.female;
  for (const goal of list) {
    if (totalEarned < goal.price) {
      return {
        goal,
        progress: Math.max(0, Math.min(1, totalEarned / goal.price)),
        achievedCount: list.indexOf(goal),
      };
    }
  }
  return null; // 全部达成
}
