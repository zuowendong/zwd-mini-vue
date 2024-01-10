// 老的 Array ->  新的 text

import { h, ref } from "../../../lib/zwd-mini-vue.esm.js";

const prevChildren = [h("p", {}, "A"), h("p", {}, "B")];
const nextChildren = "newChildren";

export const ArrayToText = {
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
