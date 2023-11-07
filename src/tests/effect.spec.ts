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

  it("scheduler", () => {
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      {
        scheduler,
      }
    );
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);

    // should be called on first trigger
    obj.foo++;
    expect(scheduler).toHaveBeenCalled();
    // should not run yet
    expect(dummy).toBe(1);
    // manually run
    run();
    // should have run
    expect(dummy).toBe(2);
  });
});
