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
            onClick: () => {
              console.log("hello");
            },
          },
          "hello"
        ),
        h(
          "p",
          {
            class: "blue",
            onMousedown: () => {
              console.log(this.msg);
            },
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
