import { h } from "../../lib/zwd-mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {
    return {
      handleClick() {
        console.log("click");
        emit("add");
        emit("add-foo");
      },
    };
  },
  render() {
    const foo = h("div", {}, "foo");
    const btn = h(
      "button",
      {
        onClick: this.handleClick,
      },
      "button"
    );
    return h("div", {}, [foo, btn]);
  },
};
