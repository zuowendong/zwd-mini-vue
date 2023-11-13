import { isReadonly, reactive, shallowReadonly } from "../reactive";

describe("shallowReadonly", () => {
  it("should not make non-reactive properties reactive", () => {
    const original = reactive({ foo: 1, bar: { baz: 2 } });

    const wapper = shallowReadonly(original);
    expect(isReadonly(wapper)).toBe(true);
    expect(isReadonly(wapper.bar)).toBe(false);
  });

  it("should call console warn when call set", () => {
    console.warn = jest.fn();
    const original = shallowReadonly({ foo: 1 });
    original.foo = 2;

    expect(console.warn).toHaveBeenCalled();
  });
});
