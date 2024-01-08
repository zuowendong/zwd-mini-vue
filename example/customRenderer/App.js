import { h } from "../../lib/zwd-mini-vue.esm.js";

export const App = {
  setup() {
    return {
      x: 50,
      y: 200,
    };
  },

  render() {
    return h("text", { x: this.x, y: this.y });
  },
};
