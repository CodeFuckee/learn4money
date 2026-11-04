/** @carbon/vue 3.x 为无类型的 UMD/CJS 包（115 个 Cv* 导出，Vue plugin 形式），
 *  为用到的组件补最小类型声明。 */
import type { DefineComponent } from "vue";

type CvComponent = DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;

declare module "@carbon/vue" {
  const CvButton: CvComponent;
  const CvTextInput: CvComponent;
  const CvNumberInput: CvComponent;
  const CvList: CvComponent;
  const CvListItem: CvComponent;
  const CvModal: CvComponent;
  const CvTile: CvComponent;
  const CvContent: CvComponent;

  export {
    CvButton,
    CvTextInput,
    CvNumberInput,
    CvList,
    CvListItem,
    CvModal,
    CvTile,
    CvContent,
  };
}
