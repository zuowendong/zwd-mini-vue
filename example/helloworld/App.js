import { h } from "../../lib/zwd-mini-vue.esm.js";

window.self = null;
export const App = {
  render() {
    window.self = this;
    return h("div", "hello " + this.msg);
  },
  setup() {
    return {
      msg: "world",
    };
  },
};
