import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadonly = false) {
  return function get(target, key) {
    let res = Reflect.get(target, key);

    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly;
    }

    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
function createSetter() {
  return function set(target, key, value) {
    let res = Reflect.set(target, key, value);
    trigger(target, key);
    return res;
  };
}

export const multableHandler = {
  get,
  set,
};

export const readonlyHandler = {
  get: readonlyGet,
  set: (target, key, value) => {
    console.warn(
      `Set operation on key ${key} failed: target is readonly`,
      target
    );
    return true;
  },
};
