import { h } from "../../lib/zwd-mini-vue.esm.js";

export const App = {
  render() {
    return h(
      "div",
      {
        id: "root",
        class: ["main", "content"],
      },
      [
        h(
          "p",
          {
            class: "red",
          },
          "hello"
        ),
        h(
          "p",
          {
            class: "blue",
          },
          "world"
        ),
      ]
    );
  },
  setup() {
    return {
      msg: "world",
    };
  },
};
