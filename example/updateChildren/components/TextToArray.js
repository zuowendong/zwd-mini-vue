// 老的 Text ->  新的 Array

import { h, ref } from "../../../lib/zwd-mini-vue.esm.js";

const prevChildren = "oldChildren";
const nextChildren = [h("p", {}, "A"), h("p", {}, "B")];

export const TextToArray = {
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
