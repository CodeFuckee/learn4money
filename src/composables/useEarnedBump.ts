/** 「金钱跳动」感观：每挣满一分钱（分位变化）触发一次金额脉冲动画。
 *  用法：组件里 ref 绑定金额元素，watch earned 分位变化 → 重放 .bump 动画。 */
import { watch, type Ref } from "vue";

export function useEarnedBump(earned: Ref<number>, el: Ref<HTMLElement | undefined>): void {
  let prev = -1;
  watch(earned, (v) => {
    const bucket = Math.floor(v * 100); // 分
    if (bucket !== prev) {
      prev = bucket;
      const node = el.value;
      if (node) {
        node.classList.remove("bump");
        void node.offsetWidth; // 强制 reflow，重启动画
        node.classList.add("bump");
      }
    }
  });
}
