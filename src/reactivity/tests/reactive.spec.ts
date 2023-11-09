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
});
