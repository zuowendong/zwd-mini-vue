import {
  multableHandler,
  readonlyHandler,
  shallowReadonlyHandler,
} from "./baseHandler";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createActiveObject(raw, multableHandler);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandler);
}
export function shallowReadonly(raw) {
  return createActiveObject(raw, shallowReadonlyHandler);
}

export function isReacive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReacive(value) || isReadonly(value);
}

function createActiveObject(raw, baseHandler) {
  return new Proxy(raw, baseHandler);
}
