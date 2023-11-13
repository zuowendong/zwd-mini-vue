import { isReacive, reactive } from "../reactive";

describe("reactive", () => {
  it("happy path", () => {
    let original = { foo: 1 };
    let data = reactive(original);

    expect(data).not.toBe(original);
    expect(data.foo).toBe(1);

    expect(isReacive(data)).toBe(true);
    expect(isReacive(original)).toBe(false);
  });

  it("nested reactive", () => {
    const original = reactive({
      nested: { foo: 1 },
      array: [{ bar: 2 }],
    });
    expect(isReacive(original.nested)).toBe(true);
    expect(isReacive(original.array)).toBe(true);
    expect(isReacive(original.array[0])).toBe(true);
  });
});
