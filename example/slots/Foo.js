import { h, renderSlots } from "../../lib/zwd-mini-vue.esm.js";

export const Foo = {
  render() {
    const foo = h("p", {}, "foo");

    console.log(this.$slots);
    const age = 18;
    return h("div", {}, [
      renderSlots(this.$slots, "header", {
        age,
      }),
      foo,
      renderSlots(this.$slots, "footer"),
    ]);
  },
  setup() {
    return {};
  },
};
