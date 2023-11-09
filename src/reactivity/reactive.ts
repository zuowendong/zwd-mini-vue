import { multableHandler, readonlyHandler } from "./baseHandler";

export function reactive(raw) {
  return createActiveObject(raw, multableHandler);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandler);
}

function createActiveObject(raw, baseHandler) {
  return new Proxy(raw, baseHandler);
}
