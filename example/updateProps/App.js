import { h, ref } from "../../lib/zwd-mini-vue.esm.js";

export const App = {
  name: "App",
  setup() {
    let count = ref(0);
    const onClick = () => {
      count.value++;
    };

    let obj = ref({
      foo: "foo",
      bar: "bar",
    });
    const changeObj1 = () => {
      obj.value.foo = "new-foo";
    };
    const changeObj2 = () => {
      obj.value.foo = undefined;
    };
    const changeObj3 = () => {
      obj.value = {
        foo: "foo",
      };
    };

    return {
      count,
      onClick,

      obj,
      changeObj1,
      changeObj2,
      changeObj3,
    };
  },
  render() {
    return h("div", { ...this.obj }, [
      h("div", {}, `count: ${this.count}`),
      h("button", { onClick: this.onClick }, "click"),
      h("button", { onClick: this.changeObj1 }, "修改foo"),
      h("button", { onClick: this.changeObj2 }, "foo为undefined"),
      h("button", { onClick: this.changeObj3 }, "没有bar"),
    ]);
  },
};
