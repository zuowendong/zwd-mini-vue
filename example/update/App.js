import { h, ref } from "../../lib/zwd-mini-vue.esm.js";

export const App = {
  name: "App",
  setup() {
    let count = ref(0);
    const onClick = () => {
      count.value++;
    };
    return {
      count,
      onClick,
    };
  },
  render() {
    return h("div", {}, [
      h("div", {}, `count: ${this.count}`),
      h(
        "button",
        {
          onClick: this.onClick,
        },
        "click"
      ),
    ]);
  },
};
