import { h } from "../../lib/zwd-mini-vue.esm.js";

export const Foo = {
  setup(props) {
    console.log(props);

    props.count++;
    console.log(props);
  },
  render() {
    return h("div", {}, "Foo:" + this.count);
  },
};
