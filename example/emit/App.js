import { h } from "../../lib/zwd-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    return h("div", {}, [
      h(Foo, {
        onAdd: () => {
          console.log("onAdd");
        },
        onAddFoo: () => {
          console.log("onAddFoo");
        },
      }),
    ]);
  },
  setup() {
    return {};
  },
};
