import { h, getCurrentInstance } from "../../lib/zwd-mini-vue.esm.js";

export const Foo = {
  name: "foo",
  render() {
    return h("p", {}, "foo");
  },
  setup() {
    const fooInstance = getCurrentInstance();
    console.log("foo", fooInstance);
  },
};
