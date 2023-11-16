import { effect } from "../effect";
import { reactive } from "../reactive";
import { isRef, proxyRefs, ref, unref } from "../ref";

describe("ref", () => {
  it("happy path", () => {
    const original = ref(1);
    expect(original.value).toBe(1);
  });

  it("should be reactive", () => {
    let data = ref(1);
    let dummy;
    let calls = 0;

    effect(() => {
      calls++;
      dummy = data.value;
    });
    expect(calls).toBe(1);
    expect(dummy).toBe(1);

    data.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);

    data.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  it("should make nested properties reactive", () => {
    let data = ref({
      count: 1,
    });
    let dummy;
    effect(() => {
      dummy = data.value.count;
    });
    expect(dummy).toBe(1);
    data.value.count = 2;
    expect(dummy).toBe(2);
  });

  it("isRef", () => {
    const a = ref(1);
    const user = reactive({
      name: "jack",
    });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(user)).toBe(false);
  });

  it("unref", () => {
    const a = ref(1);
    expect(unref(a)).toBe(1);
    expect(unref(1)).toBe(1);
  });

  it("proxyRefs", () => {
    const user = {
      name: "jack",
      age: ref(10),
    };
    const proxyUser = proxyRefs(user);

    expect(user.age.value).toBe(10);
    expect(proxyUser.age).toBe(10);

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(30);
    expect(proxyUser.age).toBe(30);
    expect(user.age.value).toBe(30);
  });
});
