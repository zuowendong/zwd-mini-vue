// 老的 text  ->  新的 text

import { h, ref } from "../../../lib/zwd-mini-vue.esm.js";

const prevChildren = "oldChildren";
const nextChildren = "newChildren";

export const TextToText = {
  setup() {
    let hasChange = ref(false);
    window.hasChange = hasChange;
    return {
      hasChange,
    };
  },
  render() {
    const self = this;
    return self.hasChange
      ? h("div", {}, nextChildren)
      : h("div", {}, prevChildren);
  },
};
