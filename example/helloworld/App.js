import { h } from "../../lib/zwd-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    return h("div", { id: "root", class: ["main", "content"] }, [
      h("p", {}, "hello"),
      h(Foo, { count: 1 }),
    ]);
  },
  setup() {
    return {
      msg: "world",
    };
  },
};