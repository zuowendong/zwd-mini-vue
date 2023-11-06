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
});
