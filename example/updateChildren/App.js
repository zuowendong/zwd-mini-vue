/**
 * 老的 Array ->  新的 text
 * 老的 text  ->  新的 text
 * 老的 text  ->  新的 Array
 * 老的 Array ->  新的 Array
 */

import { h } from "../../lib/zwd-mini-vue.esm.js";

import { ArrayToText } from "./components/ArrayToText.js";
import { TextToText } from "./components/TextToText.js";
import { TextToArray } from "./components/TextToArray.js";
import { ArrayToArray } from "./components/ArrayToArray.js";

export const App = {
  name: "App",
  setup() {
    return {};
  },
  render() {
    return h("div", {}, [
      h("p", {}, "home"),

      // 老的 Array ->  新的 text
      // h(ArrayToText),

      // 老的 text  ->  新的 text
      // h(TextToText),

      // 老的 text  ->  新的 Array
      h(TextToArray),

      // 老的 Array ->  新的 Array
      // h(ArrayToArray),
    ]);
  },
};
