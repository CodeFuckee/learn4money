/** 物质激励目标：按性别区分的阶梯清单（价格升序）
 *  累计收入每达到一档即「解锁」该目标，进度条始终指向下一档。
 *  每个目标配 Lucide 图标（图标引用，非字符串，保证类型与打包 tree-shake）。 */
import {
  Cake,
  Coffee,
  CupSoda,
  Droplet,
  Footprints,
  Gamepad,
  Gamepad2,
  Gem,
  Keyboard,
  ShoppingBag,
  Soup,
  Sparkles,
  SprayCan,
  UtensilsCrossed,
  Watch,
  type LucideIcon,
} from "lucide-vue-next";

export type Gender = "male" | "female";

export interface RewardGoal {
  name: string;
  price: number;
  icon: LucideIcon;
}

export const REWARDS: Record<Gender, RewardGoal[]> = {
  male: [
    { name: "一杯咖啡", price: 15, icon: Coffee },
    { name: "一顿烧烤", price: 45, icon: UtensilsCrossed },
    { name: "一顿火锅", price: 110, icon: Soup },
    { name: "一款新游戏", price: 199, icon: Gamepad2 },
    { name: "一双球鞋", price: 599, icon: Footprints },
    { name: "一个机械键盘", price: 899, icon: Keyboard },
    { name: "一块手表", price: 1999, icon: Watch },
    { name: "一台游戏机", price: 2999, icon: Gamepad },
  ],
  female: [
    { name: "一杯奶茶", price: 15, icon: CupSoda },
    { name: "一块蛋糕", price: 38, icon: Cake },
    { name: "一顿火锅", price: 110, icon: Soup },
    { name: "一支口红", price: 199, icon: Sparkles },
    { name: "一瓶香水", price: 399, icon: SprayCan },
    { name: "一套护肤精华", price: 899, icon: Droplet },
    { name: "一个包包", price: 1599, icon: ShoppingBag },
    { name: "一条项链", price: 2999, icon: Gem },
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
