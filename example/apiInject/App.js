import { h, provide, inject } from "../../lib/zwd-mini-vue.esm.js";

const Provider = {
  name: "provider",
  setup() {
    provide("foo", "fooVal");
    provide("bar", "barVal");
    return {};
  },
  render() {
    return h("div", {}, [h("p", {}, "provider"), h(ProviderTwo)]);
  },
};
const ProviderTwo = {
  name: "providerTwo",
  setup() {
    provide("foo", "fooTwo");
    const foo = inject("foo");
    return {
      foo,
    };
  },
  render() {
    return h("div", {}, [h("p", {}, `providerTwo：${this.foo}`), h(Consumer)]);
  },
};
const Consumer = {
  name: "consumer",
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    const baz = inject("baz", () => "bazDefault");
    return {
      foo,
      bar,
      baz,
    };
  },
  render() {
    return h("div", {}, [
      h("p", {}, `consumer：${this.foo} - ${this.bar} - ${this.baz}`),
    ]);
  },
};

export const App = {
  name: "app",
  render() {
    return h("div", {}, [h("p", {}, "app"), h(Provider)]);
  },
  setup() {
    return {};
  },
};
