import { h, getCurrentInstance } from "../../lib/zwd-mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  name: "app",
  render() {
    return h("div", {}, [h("p", {}, "app"), h(Foo)]);
  },
  setup() {
    const appInstance = getCurrentInstance();
    console.log("app", appInstance);
    return {};
  },
};
