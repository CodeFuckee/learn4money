/** 物质激励目标：按性别区分的阶梯清单（价格升序）
 *  累计收入每达到一档即「解锁」该目标，进度条始终指向下一档。 */

export type Gender = "male" | "female";

export interface RewardGoal {
  name: string;
  price: number;
}

export const REWARDS: Record<Gender, RewardGoal[]> = {
  male: [
    { name: "一杯咖啡", price: 15 },
    { name: "一顿烧烤", price: 45 },
    { name: "一顿火锅", price: 110 },
    { name: "一款新游戏", price: 199 },
    { name: "一双球鞋", price: 599 },
    { name: "一个机械键盘", price: 899 },
    { name: "一块手表", price: 1999 },
    { name: "一台游戏机", price: 2999 },
  ],
  female: [
    { name: "一杯奶茶", price: 15 },
    { name: "一杯星巴克", price: 38 },
    { name: "一顿火锅", price: 110 },
    { name: "一支口红", price: 199 },
    { name: "一瓶香水", price: 399 },
    { name: "一套护肤套装", price: 899 },
    { name: "一个包包", price: 1599 },
    { name: "一条项链", price: 2999 },
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
