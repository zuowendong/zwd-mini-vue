import { effect } from "../reactivity/effect";
import { reactive } from "../reactivity/reactive";

describe("effect", () => {
  it("happy path", () => {
    let user = reactive({
      age: 10,
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    // updater
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should be return runner when call effect", () => {
    let foo = 1;
    const runner = effect(() => {
      foo++;
      return "foo";
    });

    expect(foo).toBe(2);

    const r = runner();
    expect(foo).toBe(3);
    expect(r).toBe("foo");
  });
});
